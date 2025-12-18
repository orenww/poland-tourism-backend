import { EmailService } from './../email/email.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class SubscribersService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async subscribe(createSubscriberDto: CreateSubscriberDto, ipAddress: string) {
    const { email, language, consentGiven } = createSubscriberDto;
    console.log('[Subscribe] Starting subscription process for:', email);

    // Check if email already exists
    const existingSubscriber = await this.prisma.subscriber.findUnique({
      where: { email },
    });

    // If exists and verified - return error
    if (existingSubscriber && existingSubscriber.verified) {
      console.log('[Subscribe] Email already verified, rejecting');
      throw new BadRequestException('This email is already subscribed');
    }

    const verificationToken = this.generateVerificationToken();
    const verificationTokenExpiresAt = this.getTokenExpiration();
    console.log(
      '[Subscribe] Generated token, expires at:',
      verificationTokenExpiresAt,
    );

    if (existingSubscriber && !existingSubscriber.verified) {
      console.log(
        '[Subscribe] Generated token, expires at:',
        verificationTokenExpiresAt,
      );

      await this.prisma.subscriber.update({
        where: { email },
        data: {
          verificationToken,
          verificationTokenExpiresAt,
          ipAddress,
          language: language || 'he',
          consentGiven,
        },
      });
    } else {
      // Create new subscriber
      console.log(
        '[Subscribe] Generated token, expires at:',
        verificationTokenExpiresAt,
      );

      await this.prisma.subscriber.create({
        data: {
          email,
          verificationToken,
          verificationTokenExpiresAt,
          ipAddress,
          language: language || 'he',
          consentGiven,
        },
      });
    }

    // Send verification email
    console.log('[Subscribe] Sending verification email to:', email);
    try {
      await this.emailService.sendVerificationEmail(email, verificationToken);
      console.log('[Subscribe] Verification email sent successfully');
    } catch (error) {
      console.error('[Subscribe] Failed to send email:', error);
      throw error;
    }

    return { message: 'Verification email sent. Please check your inbox.' };
  }

  async verifyEmail(verificationToken: string) {
    // Check if email already exists
    const existingSubscriber = await this.prisma.subscriber.findUnique({
      where: { verificationToken },
    });

    // If no token found, check if already verified
    if (!existingSubscriber) {
      const alreadyVerified = await this.prisma.subscriber.findFirst({
        where: {
          verified: true,
          verificationToken: null,
        },
      });

      if (alreadyVerified) {
        return { message: 'Email already verified', alreadyVerified: true };
      }

      throw new NotFoundException('Invalid verification token');
    }

    if (
      !existingSubscriber.verificationTokenExpiresAt ||
      existingSubscriber.verificationTokenExpiresAt < new Date()
    ) {
      throw new BadRequestException('Verification token has expired');
    }

    await this.prisma.subscriber.update({
      where: { verificationToken },
      data: {
        verified: true,
        verifiedAt: new Date(),
        verificationToken: null,
        verificationTokenExpiresAt: null,
      },
    });

    return { message: 'Email verified successfully! You are now subscribed.' };
  }

  async unsubscribe(email: string) {
    const existingSubscriber = await this.prisma.subscriber.findUnique({
      where: { email },
    });

    if (!existingSubscriber) {
      throw new NotFoundException('Email does not exist');
    }

    if (existingSubscriber.unsubscribedAt) {
      return { message: 'You are already unsubscribed.' };
    }

    await this.prisma.subscriber.update({
      where: { email },
      data: {
        verified: false,
        verifiedAt: null,
        unsubscribedAt: new Date(),
        verificationToken: null,
        verificationTokenExpiresAt: null,
      },
    });

    return {
      message: 'Successfully unsubscribed. You will no longer receive emails.',
    };
  }

  // For admin panel - view all subscribers

  async findAll() {
    const subscribers = await this.prisma.subscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
      select: {
        id: true,
        email: true,
        verified: true,
        subscribedAt: true,
        unsubscribedAt: true,
        language: true,
      },
    });

    return subscribers;
  }

  // For sending emails - only verified and active subscribers
  async getVerifiedSubscribers() {
    const subscribers = await this.prisma.subscriber.findMany({
      where: {
        verified: true,
        unsubscribedAt: null,
      },
      select: {
        email: true,
        language: true,
      },
    });

    return subscribers;
  }

  // Helper method: Generate random verification token
  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Helper method: Calculate token expiration (24 hours from now)
  private getTokenExpiration(): Date {
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 24);
    return expirationDate;
  }
}
