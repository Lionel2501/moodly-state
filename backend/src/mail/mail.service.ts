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
    return (process.env.BASE_URL ?? 'https://kanjoo.vercel.app').replace(/\/$/, '');
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

  async sendSetPasswordEmail(to: string, token: string) {
    const url = `${this.baseUrl()}/inscription?token=${token}`;
    await this.send(
      to,
      'Bienvenue sur Kanjo — choisis ton nom d\'utilisateur et ton mot de passe',
      `<p>Bienvenue !</p><p>Choisis ton nom d'utilisateur et ton mot de passe pour activer ton compte :</p><p><a href="${url}">${url}</a></p>`,
    );
  }

  async sendResetPasswordEmail(to: string, username: string, token: string) {
    const url = `${this.baseUrl()}/${username}/reset-password?token=${token}`;
    await this.send(
      to,
      'Kanjo — réinitialise ton mot de passe',
      `<p>Tu as demandé à réinitialiser ton mot de passe.</p><p><a href="${url}">${url}</a></p><p>Si tu n'es pas à l'origine de cette demande, ignore cet email.</p>`,
    );
  }
}
