import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
// import { collection, getDocs, query } from 'firebase/firestore';

@Injectable()
export class ClientsService {
  constructor() {}

  async createClient(clientInfo: any): Promise<any> {
    // check user existence?
    try {
        let response;
      const docRef = await admin.firestore().collection('client_space');
      await docRef
        .where('FirstName', '==', clientInfo.FirstName)
        .get()
        .then(async (result) => {
            if(result.empty) {
                console.log("empty");
                await docRef.doc().set(clientInfo).then((data) => {
                    console.log("set client: ", data);
                    response = {clientExists: false};
                });
            } else {
            console.log("not empty");
                result.forEach((doc) => {
                    response = {clientExists: true, client: doc.data()};
                });
            }
        });
        return response;
    } catch (error) {
      console.log('An error occured creating client: ', error);
    }
  }

  async getLocations() {
    try {
        let response;
        await admin.firestore().collection('upf_locations').get().then((data) => {
            data.forEach((doc) => {
                response =  doc.data();
                // console.log("doc: ", doc.data());
            });
        });
        return response;
    } catch (error) {
        console.log("An error occurred getting service locations: ", error);
        return {errorStatus: 'No locations', error: error}; 
        
    }
  }
}
