// import { NestFactory } from '@nestjs/core';
// import { ExpressAdapter } from '@nestjs/platform-express';
// import { AppModule } from './app.module';
// import * as express from 'express';
// import * as functions from 'firebase-functions/v2';

// const server = express();

// export const createNestServer = async (expressInstance) => {
//   const app = await NestFactory.create(
//     AppModule,
//     new ExpressAdapter(expressInstance),
//   );
//   app.enableCors();
//   return app.init();
// };



// createNestServer(server)
//     .then(v => console.log('Nest Ready'))
//     .catch(err => console.error('Nest broken', err));

// export const api = functions.https.onRequest(server);


// //---------------------------------------------------------------------------------------------------------

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// // import * as admin from 'firebase-admin';
// import * as express from 'express';
// import * as cors from 'cors';
// import * as dotenv from 'dotenv';
// dotenv.config();

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.use(
//     cors({
//       methods: ['GET', 'PUT', 'POST'],
//       origin: ['http://localhost:8100', 'http://127.0.0.1:8100'],
//       credentials: true,
//       allowedHeaders: ['Content-Type', 'Authorization'], 

//     }),
//   );
//   app.use(express.urlencoded({ extended: true }));
//   await app.listen(3000, () => {
//     console.log('The application is running on localhost:3000!');
//   });
// }

// bootstrap();