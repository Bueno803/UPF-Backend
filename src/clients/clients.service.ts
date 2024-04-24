import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
// import { collection, getDocs, query } from 'firebase/firestore';

@Injectable()
export class ClientsService {
  constructor() {}

  async createClient(clientInfo: any): Promise<any> {
    // check user existence?
    try {
      const docRef = await admin.firestore().collection('client_space');
      await docRef
        .where('FirstName', '==', clientInfo.FirstName)
        .get()
        .then((result) => {
          result.forEach((doc) => {
            console.log('document: ', doc);
          });
        });
      //   const quierySnapshot = await getDocs(result);
      //   console.log('result: ', quierySnapshot);
      //   await docRef.get().then(async (clients) => {
      //     clients.data().data.forEach((client) => {
      //       if (
      //         clientInfo.firstname == client.FirstName &&
      //         clientInfo.lastname == client.LastName
      //       ) {
      //         return { resData: 'user exists', client: client };
      //       }
      //       console.log('individual clients: ', client);
      //     });
      //     // console.log("3 ", clients.data().data[0]);
      //     // console.log("1 ", clients);
      //     await docRef.set(clientInfo).then(() => {
      //       return { resData: 'success' };
      //     });
      //   });
    } catch (error) {
      console.log('An error occured creating client: ', error);
    }
  }
}
