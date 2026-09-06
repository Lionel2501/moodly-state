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
import { ResetPasswordDto } from './dto/reset-password.dto';
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
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: null,
        passwordHash: null,
      },
    });

    const token = await this.issueToken(user.id, 'SET_PASSWORD');
    await this.mailService.sendSetPasswordEmail(user.email, token);

    return {
      message: "Compte créé, vérifie tes emails pour choisir ton nom d'utilisateur et ton mot de passe",
    };
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

    return this.buildToken(user.id, user.username!);
  }

  async setPassword(dto: SetPasswordDto) {
    return this.completeToken(dto.token, 'SET_PASSWORD', dto.password, dto.username);
  }

  async resetPassword(dto: ResetPasswordDto) {
    return this.completeToken(dto.token, 'RESET_PASSWORD', dto.password);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ username: dto.identifier }, { email: dto.identifier }] },
    });

    if (user && user.passwordHash) {
      const token = await this.issueToken(user.id, 'RESET_PASSWORD');
      await this.mailService.sendResetPasswordEmail(user.email, user.username!, token);
    }

    return { message: 'Si un compte existe, un email a été envoyé' };
  }

  private async completeToken(
    rawToken: string,
    purpose: TokenPurpose,
    password: string,
    newUsername?: string,
  ) {
    const tokenHash = this.hashToken(rawToken);
    const authToken = await this.prisma.authToken.findUnique({ where: { tokenHash } });

    if (
      !authToken ||
      authToken.purpose !== purpose ||
      authToken.usedAt ||
      authToken.expiresAt < new Date()
    ) {
      throw new BadRequestException('Lien invalide ou expiré');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    let username: string | undefined;

    if (purpose === 'SET_PASSWORD') {
      username = (newUsername ?? '').toLowerCase();
      if (RESERVED_USERNAMES.has(username)) {
        throw new ConflictException('This username is reserved, please choose another one');
      }
      const existing = await this.prisma.user.findUnique({ where: { username } });
      if (existing && existing.id !== authToken.userId) {
        throw new ConflictException('Username already in use');
      }
    }

    const [user] = await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: authToken.userId },
        data: { passwordHash, ...(username ? { username } : {}) },
      }),
      this.prisma.authToken.update({ where: { id: authToken.id }, data: { usedAt: new Date() } }),
    ]);

    return this.buildToken(user.id, user.username!);
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
