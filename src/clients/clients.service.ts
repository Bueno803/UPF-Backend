import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
// import { collection, getDocs, query } from 'firebase/firestore';

@Injectable()
export class ClientsService {
  constructor() {}

  async getClients() {
    try {
      const response = [];
      const docRef = await admin.firestore().collection('client_space');
      await docRef.get().then(async (result) => {
        result.forEach((doc) => {
          // console.log('Test ', doc.data().FirstName, ' ', doc.data().ClientID);
          response.push(doc.data());
        });
      });
      return response;
    } catch (error) {
      return error;
    }
  }

  async createClient(clientInfo: any): Promise<any> {
    // check user existence?
    try {
      let response;
      const docRef = await admin.firestore().collection('client_space');
      await docRef
        .where('FirstName', '==', clientInfo.FirstName)
        .where('LastName', '==', clientInfo.LastName)
        .get()
        .then(async (result) => {
          const docId = await docRef.doc();
          clientInfo.ClientID = docId.id;
          if (result.empty) {
            console.log('Client will Created');
            await docId.set(clientInfo).then((data) => {
              console.log('set client: ', data);
              response = { clientCreated: true };
            });
          } else {
            console.log('Client will not created');
            // result.forEach((doc) => {
            response = { clientCreated: false, client: clientInfo };
            // });
          }
        });
      return response;
    } catch (error) {
      console.log('An error occured creating client: ', error);
    }
  }

  async createClientAnyway(clientInfo: any): Promise<any> {
    // check user existence?
    console.log('createClientAnyway');
    try {
      let response;
      console.log('cc', clientInfo);

      await admin
        .firestore()
        .collection('client_space')
        .doc(clientInfo.ClientID)
        .set(clientInfo)
        .then((resData) => {
          console.log('set client anyway: ', resData);
          response = { clientCreated: true };
        });
      return response;
    } catch (error) {
      console.log('An error occured creating client: ', error);
    }
  }

  async updateClient(client: any) {
    try {
      const docRef = await admin.firestore().collection('client_space');
      const cleanClient = client;

      Object.keys(cleanClient).forEach((key) =>
        cleanClient[key] === undefined ? delete cleanClient[key] : {},
      );

      console.log('Clean Client: ', cleanClient);
      docRef.doc(client.ClientID).update(cleanClient);
      return { updateStatus: true };
    } catch (error) {
      console.log('An error occurred update client: ', error);
      return { updateStatus: false, error };
    }
  }

  async disableClient(clientID: string, disabledTimeStamp: number) {
    try {
      let response;
      const docRef = await admin.firestore().collection('client_space');
      docRef
        .doc(clientID)
        .update({ lastDisabled: disabledTimeStamp, isActive: false });
      await docRef
        .where('ClientID', '==', clientID)
        .get()
        .then(async (result) => {
          result.forEach((client) => {
            response = client.data();
          });
        });
      return { updateStatus: true, response };
    } catch (error) {
      console.log('An error occurred update client: ', error);
      return { updateStatus: false, error };
    }
  }

  async enableClient(clientID: string) {
    try {
      let response;
      const docRef = await admin.firestore().collection('client_space');
      docRef.doc(clientID).update({ lastDisabled: null, isActive: true });
      await docRef
        .where('ClientID', '==', clientID)
        .get()
        .then(async (result) => {
          result.forEach((client) => {
            response = client.data();
          });
        });
      return { updateStatus: true, response };
    } catch (error) {
      console.log('An error occurred update client: ', error);
      return { updateStatus: false, error };
    }
  }

  async purgeInactives(deleteDate: number) {
    try {
      const poppedClients = [];
      console.log(deleteDate);
      const docRef = await admin.firestore().collection('client_space');
      await docRef
        .where('isActive', '==', false)
        .get()
        .then(async (result) => {
          result.forEach((clients) => {
            console.log(
              'lastDisabled: ',
              clients.data().lastDisabled,
              ' deleteData: ',
              deleteDate,
            );
            if (clients.data().lastDisabled < deleteDate) {
              console.log('delete inside');
              poppedClients.push({ ClientID: clients.data().ClientID });
              docRef.doc(clients.data().ClientID).delete();
            }
            // console.log('this clients name: ', clients.data().FirstName);
            // console.log(clients.data());
            // response = client.data();
          });
        });
      console.log(poppedClients);
      return poppedClients;
    } catch (error) {
      console.log('An error occurred purging clients: ', error);
      return error;
    }
  }

  async getLocations() {
    try {
      const response = [];
      await admin
        .firestore()
        .collection('upf_locations')
        .get()
        .then((data) => {
          data.forEach((doc) => {
            response.push(doc.data());
            // console.log("doc: ", doc.data());
          });
          // console.log('r ', response);
        });
      return response;
    } catch (error) {
      console.log('An error occurred getting service locations: ', error);
      return { errorStatus: 'No locations', error: error };
    }
  }

  async getServiceTypes() {
    try {
      const response = [];
      await admin
        .firestore()
        .collection('service_type')
        .get()
        .then((data) => {
          console.log('service_types data ', data);
          data.forEach((doc) => {
            console.log('service_types doc ', doc);
            response.push(doc.data());
            // console.log("doc: ", doc.data());
          });
          // console.log('r ', response);
        });
      return response;
    } catch (error) {
      console.log('An error occurred getting service types: ', error);
      return { errorStatus: 'No locations', error: error };
    }
  }

  async addLocation(newLoc: any) {
    try {
      let response;
      const docRef = await admin.firestore().collection('upf_locations');
      await docRef
        .where('LocationName', '==', newLoc.LocationName)
        .get()
        .then(async (result) => {
          if (result.empty) {
            console.log('empty');
            const docId = await docRef.doc();
            const newLocation = {
              id: docId.id,
              LocationName: newLoc.LocationName,
            };
            await docId.set(newLocation).then((data) => {
              console.log('set client: ', data);
              response = newLocation;
            });
          } else {
            console.log('not empty');
            response = null;
          }
        });
      console.log('returning: ', response);
      return response;
    } catch (error) {
      console.log('An error occurred on adding location: ', error);
      return error;
    }
  }

  async removeLocation(newLoc: any) {
    try {
      let response;
      const docRef = await admin.firestore().collection('upf_locations');
      await docRef
        .where('LocationName', '==', newLoc.LocationName)
        .get()
        .then(async (result) => {
          if (result.empty) {
            response = { message: 'Location does not exist...' };
          } else {
            await docRef
              .doc(newLoc.id)
              .delete()
              .catch((error) => {
                response = error;
              });
          }
        });
      console.log('the response: ', response);
      return response;
    } catch (error) {
      console.log('An error occurred on adding location: ', error);
      return error;
    }
  }
}
