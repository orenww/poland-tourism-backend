import { Module } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { SubscribersController } from './subscribers.controller';
import { EmailModule } from 'src/email/email.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [EmailModule],
  controllers: [SubscribersController],
  providers: [SubscribersService, PrismaService],
})
export class SubscribersModule {}
