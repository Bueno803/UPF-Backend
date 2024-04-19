import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // admin.initializeApp({
  //   credential: admin.credential.cert({
  //     privateKey: process.env.PRIVATE_KEY,
  //     clientEmail: process.env.CLIENT_EMAIL,
  //     projectId: process.env.PROJECT_ID,
  //   } as Partial<admin.ServiceAccount>),
  //   databaseURL: process.env.DATABASE_URL
  // })
  app.use(
    cors({
      methods: ['GET', 'PUT', 'POST'],
      origin: ['http://localhost:8100', 'http://127.0.0.1:8100'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'], // Specify the allowed headers
      // origin: allowedOrigins,
    }),
  );
  app.use(express.urlencoded({ extended: true }));
  await app.listen(3000, () => {
    console.log('The application is running on localhost:3000!');
  });
}

bootstrap();
