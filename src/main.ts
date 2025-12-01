import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS for production and development
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://poland-tourism-client.vercel.app',
      /\.vercel\.app$/,
      /\.railway\.app$/,
    ],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
