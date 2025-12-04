import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ItemsModule } from './items/items.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CategoriesModule } from './categories/categories.module';
import { SubitemsModule } from './subitems/subitems.module';
import { CacheModule } from './cache/cache.module';
import { ChainsModule } from './chains/chains.module';

@Module({
  imports: [
    CacheModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 60, // 10 requests per 60 seconds
      },
    ]),
    PrismaModule,
    ItemsModule,
    AuthModule,
    CategoriesModule,
    SubitemsModule,
    ChainsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
