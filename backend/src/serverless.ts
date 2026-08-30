import 'reflect-metadata';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';

const server = express();
let bootstrapped: Promise<void> | null = null;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  const corsOrigin = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim());

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');

  await app.init();
}

// Vercel Node functions call handlers with plain (req, res); an Express
// instance is directly callable that way, so no Lambda-event shim is needed.
export default async function handler(req: express.Request, res: express.Response) {
  if (!bootstrapped) {
    bootstrapped = bootstrap();
  }
  await bootstrapped;
  server(req, res);
}
