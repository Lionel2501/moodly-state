import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from './decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';

const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, user } = await this.authService.login(dto);
    this.setSessionCookie(res, accessToken);
    return { user };
  }

  @Post('set-password')
  async setPassword(@Body() dto: SetPasswordDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, user } = await this.authService.setPassword(dto);
    this.setSessionCookie(res, accessToken);
    return { user };
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: SetPasswordDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, user } = await this.authService.resetPassword(dto);
    this.setSessionCookie(res, accessToken);
    return { user };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(process.env.COOKIE_NAME ?? 'linka_session');
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() currentUser: CurrentUserPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: currentUser.userId },
      select: { id: true, username: true, email: true },
    });
    return { user };
  }

  private setSessionCookie(res: Response, accessToken: string) {
    res.cookie(process.env.COOKIE_NAME ?? 'linka_session', accessToken, {
      httpOnly: true,
      sameSite: (process.env.COOKIE_SAMESITE ?? 'lax') as 'lax' | 'strict' | 'none',
      secure: process.env.COOKIE_SECURE === 'true',
      maxAge: COOKIE_MAX_AGE_MS,
      path: '/',
    });
  }
}
