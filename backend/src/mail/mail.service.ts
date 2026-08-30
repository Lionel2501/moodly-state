import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

  private baseUrl(): string {
    return (process.env.BASE_URL ?? 'http://localhost:5173').replace(/\/$/, '');
  }

  private async send(to: string, subject: string, html: string) {
    if (!this.resend) {
      this.logger.warn(
        `RESEND_API_KEY is not set — logging email instead of sending.\nTo: ${to}\nSubject: ${subject}\n${html}`,
      );
      return;
    }

    await this.resend.emails.send({
      from: process.env.MAIL_FROM ?? 'moodly state <onboarding@resend.dev>',
      to,
      subject,
      html,
    });
  }

  async sendSetPasswordEmail(to: string, username: string, token: string) {
    const url = `${this.baseUrl()}/${username}/inscription?token=${token}`;
    await this.send(
      to,
      'Bienvenue sur moodly state — choisis ton mot de passe',
      `<p>Bienvenue ${username} !</p><p>Choisis ton mot de passe pour activer ton compte :</p><p><a href="${url}">${url}</a></p>`,
    );
  }

  async sendResetPasswordEmail(to: string, username: string, token: string) {
    const url = `${this.baseUrl()}/${username}/reset-password?token=${token}`;
    await this.send(
      to,
      'moodly state — réinitialise ton mot de passe',
      `<p>Tu as demandé à réinitialiser ton mot de passe.</p><p><a href="${url}">${url}</a></p><p>Si tu n'es pas à l'origine de cette demande, ignore cet email.</p>`,
    );
  }
}
