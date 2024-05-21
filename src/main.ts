// import * as admin from 'firebase-admin';
// import * as cors from 'cors';
// import * as dotenv from 'dotenv';
// dotenv.config();
// const {onRequest} = require("firebase-functions/v2/https")
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import * as functions from 'firebase-functions/v2';
import * as afunctions from '@google-cloud/functions-framework';

// async function bootstrap() {
const expressServer = express();
const createFunction = async (expressInstance): Promise<void> => {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    // { cors: true },
  );

//   /**
//  * HTTP function that supports CORS requests.
//  *
//  * @param {Object} req Cloud Function request context.
//  * @param {Object} res Cloud Function response context.
//  */
//   afunctions.http('corsEnabledFunction', (req, res) => {
//     // Set CORS headers for preflight requests
//     // Allows GETs from any origin with the Content-Type header
//     // and caches preflight response for 3600s
  
//     res.set('Access-Control-Allow-Origin', '*');
  
//     if (req.method === 'OPTIONS') {
//       // Send response to OPTIONS requests
//       res.set('Access-Control-Allow-Methods', 'GET');
//       res.set('Access-Control-Allow-Headers', 'Content-Type');
//       res.set('Access-Control-Max-Age', '3600');
//       res.status(204).send('');
//     } else {
//       res.send('Hello World!');
//     }
//   });

  // const whitelist = [
  //   'http://localhost:8100/',
  //   'http://localhost:8100',
  //   'https://www.upf-mobile.com/',
  //   '*',
  //   undefined,
  // ];
  app.enableCors({
    allowedHeaders: ['content-type'],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    origin:[
      'http://localhost:8100',
      'http://upf-mobile.com',
      'http://www.upf-mobile.com',
      'http://app.upf-mobile.com',
      'https://upf-mobile.com',
      'https://www.upf-mobile.com',
      'https://app.upf-mobile.com',
    ],
  credentials: true,
  // preflightContinue: false
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
export const api = functions.https.onRequest({concurrency: 100}, async (request, res) => {
  // res.set('Access-Control-Allow-Origin', '*');
  //   // if (request.method === 'OPTIONS') {
  //     // Send response to OPTIONS requests
  //     res.set('Access-Control-Allow-Methods', 'GET');
  //     res.set('Access-Control-Allow-Methods', 'POST');
  //     res.set('Access-Control-Allow-Headers', 'Content-Type');
  //     res.set('Access-Control-Max-Age', '3600');
  //     res.status(204).send('');
    // } else {
    //   res.send('Hello World!');
    // }

  await createFunction(expressServer);
  expressServer(request, res);
});

// bootstrap();
