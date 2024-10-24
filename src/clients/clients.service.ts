import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

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
    } catch (error) {}
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
        Attendance: [
          { date: 'N/A' },
          { date: 'N/A' },
          { date: 'N/A' },
          { date: 'N/A' },
          { date: 'N/A' },
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
        FormsRdy: false,
        BlocksRdy: false,
        HandAtksRdy: false,
        KicksRdy: false,
      });
      return 'Successfully added to schedule!';
    } catch (error) {
      console.log('An error occurred adding client to schedule: ', error);
      return error;
    }
  }

  async purgeFromSchedule(clientID: string) {
    try {
      const isReadyRef = await admin.firestore().collection('test_ready');
      const beltProgressRef = await admin
        .firestore()
        .collection('tkd_belttest_progress');
      const scheduleRef = await admin
        .firestore()
        .collection('tkd_schedule_info');

      await isReadyRef
        .doc(clientID)
        .delete()
        .catch((error) => {
          return error;
        });
      await beltProgressRef
        .doc(clientID)
        .delete()
        .catch((error) => {
          return error;
        });
      await scheduleRef
        .doc(clientID)
        .delete()
        .catch((error) => {
          return error;
        });
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
        .then(() => {
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
      // Firestore references
      const clientRef = admin
        .firestore()
        .collection('client_space')
        .doc(client.ClientID);
      const beltProgressRef = admin
        .firestore()
        .collection('tkd_belttest_progress')
        .doc(client.ClientID);
      const testReadyRef = admin
        .firestore()
        .collection('test_ready')
        .doc(client.ClientID);

      // Fetch the current client data from 'client_space'
      const clientSnapshot = await clientRef.get();
      const currentClientData = clientSnapshot.data();

      // Clean the client object by removing undefined values
      const cleanClient = { ...client };
      Object.keys(cleanClient).forEach((key) =>
        cleanClient[key] === undefined ? delete cleanClient[key] : {},
      );

      // Update 'client_space' collection with sanitized data
      await clientRef.update(cleanClient);

      // Check if 'beltLvl' has changed
      if (client.BeltLvl && currentClientData.BeltLvl !== client.BeltLvl) {
        // Update 'tkd_belttest_progress' and 'test_ready' collections
        await beltProgressRef.update({ BeltLvl: client.BeltLvl });
        await testReadyRef.update({
          BlocksRdy: false,
          FormsRdy: false,
          HandAtksRdy: false,
          KicksRdy: false,
        });
      }

      return { updateStatus: true };
    } catch (error) {
      console.error('An error occurred while updating the client: ', error);
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
      const docRef = await admin.firestore().collection('client_space');
      await docRef
        .where('isActive', '==', false)
        .get()
        .then(async (result) => {
          result.forEach((clients) => {
            if (clients.data().lastDisabled < deleteDate) {
              poppedClients.push({ ClientID: clients.data().ClientID });
              docRef.doc(clients.data().ClientID).delete();
              this.purgeFromSchedule(clients.data().ClientID);
            }
          });
        });
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
          data.forEach((doc) => {
            response.push(doc.data());
          });
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
      const docStampRef = await admin
        .firestore()
        .collection('last_class_time_stamp');
      await docRef
        .where('LocationName', '==', newLoc.LocationName)
        .get()
        .then(async (result) => {
          if (result.empty) {
            const docId = await docRef.doc();
            const docStampId = await docStampRef.doc();
            const newLocation = {
              id: docId.id,
              LocationName: newLoc.LocationName,
            };
            await docId.set(newLocation).then(() => {
              response = newLocation;
            });
            await docStampId.set({
              ID: docStampId.id,
              LocationID: docId.id,
              Advanced: {
                Page: 'Forms',
                time: 'N/A',
              },
              Beginner: { Page: 'Forms', time: 'N/A' },
              ['Lil-Tiger']: { Page: 'Forms', time: 'N/A' },
              Misc: { Page: 'Forms', time: 'N/A' },
            });
          } else {
            response = null;
          }
        });
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
      const docStampRef = await admin
        .firestore()
        .collection('last_class_time_stamp');
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

      await docStampRef
        .where('LocationID', '==', newLoc.id)
        .get()
        .then(async (result) => {
          if (result.empty) {
            response = { message: 'Location does not exist...' };
          } else {
            result.forEach(async (doc) => {
              await docStampRef
                .doc(doc.data().ID)
                .delete()
                .catch((error) => {
                  response = error;
                });
            });
          }
        });
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

  // async updateAttendance(attendanceList: any) {
  //   try {
  //     const allClients = [];
  //     const updatedClients = [];
  //     const docRef = await admin.firestore().collection('tkd_schedule_info');
  //     await docRef.get().then((result) => {
  //       result.forEach((doc) => {
  //         allClients.push(doc.data());
  //       });
  //     });
  //     attendanceList.forEach(async (client) => {
  //       const clientIndex = allClients.findIndex(
  //         (cl) => cl.ClientID === client.ClientID,
  //       );
  //       console.log(
  //         allClients[clientIndex].Attendance[
  //           allClients[clientIndex].Attendance.length
  //         ].date,
  //       );
  //       // allClients[clientIndex].Attendance.push({ date: client.date });
  //       // allClients[clientIndex].Attendance.shift();
  //       // updatedClients.push(allClients[clientIndex]);
  //     });
  //     // updatedClients.forEach((data) => {
  //     //   docRef.doc(data.ClientID).update(data);
  //     // });
  //     return { updatedClients: updatedClients };
  //   } catch (error) {
  //     console.log('An error occurred while updating attendance', error);
  //   }
  // }
}
