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
            await docId.set(clientInfo).then(() => {
              response = { clientCreated: true };
            });
            response.schedule = await this.addToSchedule({
              ClientID: clientInfo.ClientID,
              FirstName: clientInfo.FirstName,
              LastName: clientInfo.LastName,
              Age: clientInfo.Age,
              BeltLvl: clientInfo.BeltLvl,
            });
          } else {
            response = { clientCreated: false, client: clientInfo };
          }
        });
      return response;
    } catch (error) {
      console.log('An error occured creating client: ', error);
    }
  }

  async addToSchedule(clientInfo: any) {
    try {
      let classByAge;
      if (clientInfo.Age > 5) {
        classByAge = true;
      } else {
        classByAge = false;
      }
      const isReadyRef = await admin.firestore().collection('test_ready');
      const beltProgressRef = await admin
        .firestore()
        .collection('tkd_belttest_progress');
      const scheduleRef = await admin
        .firestore()
        .collection('tkd_schedule_info');
      await scheduleRef.doc(clientInfo.ClientID).set({
        ClientID: clientInfo.ClientID,
        FirstName: clientInfo.FirstName,
        LastName: clientInfo.LastName,
        Age: clientInfo.Age,
        BeltLvl: clientInfo.BeltLvl,
        isAdvanced: classByAge,
        Present: false,
        //want to keep track of the last 5 dates each student attended a class
        Attendance: [
          {
            date1: 'N/A',
            date2: 'N/A',
            date3: 'N/A',
            date4: 'N/A',
            date5: 'N/A',
          },
        ],
        Ready: false,
      });
      await beltProgressRef.doc(clientInfo.ClientID).set({
        ClientID: clientInfo.ClientID,
        BeltLvl: clientInfo.BeltLvl,
        isAdvanced: classByAge,
        FormsTID: 1,
        BlocksTID: 1,
        HandAtksTID: 1,
        KicksTID: 1,
      });
      await isReadyRef.doc(clientInfo.ClientID).set({
        ClientID: clientInfo.ClientID,
        FormsRdy: 1,
        BlocksRdy: 1,
        HandAtksRdy: 1,
        KicksRdy: 1,
      });
      return 'Successfully added to schedule!';
    } catch (error) {
      console.log('An error occurred adding client to schedule: ', error);
      return error;
    }
  }

  async createClientAnyway(clientInfo: any): Promise<any> {
    try {
      let response;
      await admin
        .firestore()
        .collection('client_space')
        .doc(clientInfo.ClientID)
        .set(clientInfo)
        .then((resData) => {
          console.log('set client anyway: ', resData);
          response = { clientCreated: true };
        });
      response.schedule = await this.addToSchedule({
        ClientID: clientInfo.ClientID,
        FirstName: clientInfo.FirstName,
        LastName: clientInfo.LastName,
        Age: clientInfo.Age,
        BeltLvl: clientInfo.BeltLvl,
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
          });
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

  async getSchedule() {
    try {
      const response = [];
      const docRef = await admin.firestore().collection('tkd_schedule_info');
      await docRef.get().then(async (result) => {
        result.forEach((doc) => {
          response.push(doc.data());
        });
      });
      return response;
    } catch (error) {
      console.log('An error occurred fetching the client schedule: ', error);
      return error;
    }
  }
  async deleteCustom() {
    try {
      let response;
      const docRef = await admin.firestore().collection('tkd_schedule_info');
      for (let i = 1; i < 43; i++) {
        await docRef
          .doc(i.toString())
          .delete()
          .catch((error) => {
            response = error;
          });
      }
      return response;
    } catch (error) {
      console.log('An error occurred on adding location: ', error);
      return error;
    }
  }

  async updateAttendance(attendanceList: any) {
    try {
      console.log('attendanceList ', attendanceList);
      const allClients = [];
      const updatedClients = [];
      const docRef = await admin.firestore().collection('tkd_schedule_info');
      await docRef.get().then((result) => {
        result.forEach((doc) => {
          allClients.push(doc.data());
        });
      });
      console.log('All clients: ', allClients);

      attendanceList.forEach(async (client) => {
        const clientIndex = allClients.findIndex(
          (cl) => cl.ClientID === client.ClientID,
        );
        allClients[clientIndex].Attendance.push({ date: client.date });
        allClients[clientIndex].Attendance.shift();
        updatedClients.push(allClients[clientIndex]);
      });
      updatedClients.forEach((data) => {
        docRef.doc(data.ClientID).update(data);
        // console.log(data.Attendance);
      });
      return { updatedClients: updatedClients };
      // console.log(updatedClients);
    } catch (error) {
      console.log('An error occurred while updating attendance', error);
    }
  }
}
