import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes, createHash } from 'crypto';
import { TokenPurpose } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RESERVED_USERNAMES } from './reserved-usernames';

const SALT_ROUNDS = 10;
const TOKEN_TTL_MS = 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    if (RESERVED_USERNAMES.has(dto.username.toLowerCase())) {
      throw new ConflictException('This username is reserved, please choose another one');
    }

    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] },
    });
    if (existing) {
      throw new ConflictException('Email or username already in use');
    }

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        passwordHash: null,
      },
    });

    const token = await this.issueToken(user.id, 'SET_PASSWORD');
    await this.mailService.sendSetPasswordEmail(user.email, user.username, token);

    return { message: 'Compte créé, vérifie tes emails pour définir ton mot de passe' };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException(
        !user ? 'Invalid credentials' : 'Compte pas encore activé, vérifie tes emails',
      );
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildToken(user.id, user.username);
  }

  async setPassword(dto: SetPasswordDto) {
    return this.completeToken(dto.username, dto.token, 'SET_PASSWORD', dto.password);
  }

  async resetPassword(dto: SetPasswordDto) {
    return this.completeToken(dto.username, dto.token, 'RESET_PASSWORD', dto.password);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ username: dto.identifier }, { email: dto.identifier }] },
    });

    if (user && user.passwordHash) {
      const token = await this.issueToken(user.id, 'RESET_PASSWORD');
      await this.mailService.sendResetPasswordEmail(user.email, user.username, token);
    }

    return { message: 'Si un compte existe, un email a été envoyé' };
  }

  private async completeToken(
    username: string,
    rawToken: string,
    purpose: TokenPurpose,
    password: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new BadRequestException('Lien invalide ou expiré');
    }

    const tokenHash = this.hashToken(rawToken);
    const authToken = await this.prisma.authToken.findUnique({ where: { tokenHash } });

    if (
      !authToken ||
      authToken.userId !== user.id ||
      authToken.purpose !== purpose ||
      authToken.usedAt ||
      authToken.expiresAt < new Date()
    ) {
      throw new BadRequestException('Lien invalide ou expiré');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: user.id }, data: { passwordHash } }),
      this.prisma.authToken.update({ where: { id: authToken.id }, data: { usedAt: new Date() } }),
    ]);

    return this.buildToken(user.id, user.username);
  }

  private async issueToken(userId: string, purpose: TokenPurpose) {
    const rawToken = randomBytes(32).toString('hex');
    await this.prisma.authToken.create({
      data: {
        userId,
        purpose,
        tokenHash: this.hashToken(rawToken),
        expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
      },
    });
    return rawToken;
  }

  private hashToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }

  private buildToken(userId: string, username: string) {
    const accessToken = this.jwtService.sign({ sub: userId, username });
    return { accessToken, user: { id: userId, username } };
  }
}
