import { Module } from '@nestjs/common';
import { SubitemsService } from './subitems.service';
import { SubitemsController } from './subitems.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SubitemsController],
  providers: [SubitemsService, PrismaService],
})
export class SubitemsModule {}
