import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter = process.env.SMTP_HOST
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 465),
        secure: process.env.SMTP_SECURE !== 'false',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    : null;

  private baseUrl(): string {
    return (process.env.BASE_URL ?? 'http://localhost:5173').replace(/\/$/, '');
  }

  private async send(to: string, subject: string, html: string) {
    if (!this.transporter) {
      this.logger.warn(
        `SMTP_HOST is not set — logging email instead of sending.\nTo: ${to}\nSubject: ${subject}\n${html}`,
      );
      return;
    }

    await this.transporter.sendMail({
      from: process.env.MAIL_FROM ?? process.env.SMTP_USER,
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
