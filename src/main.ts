// import * as admin from 'firebase-admin';
// import * as cors from 'cors';
// import * as dotenv from 'dotenv';
// dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import * as functions from 'firebase-functions';

// async function bootstrap() {
const expressServer = express();
const createFunction = async (expressInstance): Promise<void> => {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressInstance),
    // { cors: true },
  );
  // const whitelist = [
  //   'http://localhost:8100/',
  //   'http://localhost:8100',
  //   'https://www.upf-mobile.com/',
  //   '*',
  //   undefined,
  // ];
  app.enableCors({
    // origin: true,
    // // allowedHeaders: [
    // //   'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
    // // ],
    // methods: ['GET', 'POST', 'PULL', 'DELETE', 'OPTIONS'],
    // // credentials: true,
    // // preflightContinue: true,
    // // optionsSuccessStatus: 200,
  });
  await app.init();
};
// admin.initializeApp({
//   credential: admin.credential.cert({
//     privateKey: process.env.PRIVATE_KEY,
//     clientEmail: process.env.CLIENT_EMAIL,
//     projectId: process.env.PROJECT_ID,
//   } as Partial<admin.ServiceAccount>),
//   databaseURL: process.env.DATABASE_URL
// })
// app.use(
//   cors({
//     methods: ['GET', 'PUT', 'POST', 'DELETE'],
//     origin: [
//       'http://localhost:8100',
//       'http://127.0.0.1:8100',
//       'http://localhost:4200',
//       'http://127.0.0.1:4200',
//     ],
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization'], // Specify the allowed headers
//     // origin: allowedOrigins,
//   }),
// );
// app.use(express.urlencoded({ extended: true }));
// await app.listen(3000, () => {
//   console.log('The application is running on localhost:3000!');
// });
// }
export const api = functions.https.onRequest(async (request, response) => {
  await createFunction(expressServer);
  expressServer(request, response);
});

// bootstrap();
