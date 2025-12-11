import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    this.resend = new Resend(apiKey);
  }

  async sendVerificationEmail(email: string, verificationToken: string) {
    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${verificationToken}`;

    const fromEmail = this.configService.get<string>('RESEND_FROM_EMAIL');
    if (!fromEmail) {
      throw new Error('RESEND_FROM_EMAIL is not configured');
    }

    const msg = {
      to: email,
      from: fromEmail,
      subject: 'Verify your email - Poland Tourism',
      html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Welcome to Poland Tourism!</h2>
                <p>Please verify your email address to complete your subscription.</p>
                <p>
                <a href="${verificationUrl}" 
                    style="background-color: #4CAF50; color: white; padding: 12px 24px; 
                            text-decoration: none; border-radius: 4px; display: inline-block;">
                    Verify Email
                </a>
                </p>
                <p>Or copy this link: ${verificationUrl}</p>
                <p style="color: #666; font-size: 12px;">
                This link will expire in 24 hours.
                </p>
            </div>
        `,
    };

    await this.resend.emails.send(msg);
  }
}
