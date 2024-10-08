import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class ClassInProgressService {
  create(createClassInProgressDto: any) {
    return createClassInProgressDto;
  }

  async findAll() {
    try {
      const response = [];
      const docRef = await admin
        .firestore()
        .collection('tkd_belttest_progress');
      await docRef.get().then(async (result) => {
        result.forEach((doc) => {
          response.push(doc.data());
        });
      });
      return response;
    } catch (error) {
      console.log('An error occurred fetching student progress: ', error);
      return error;
    }
  }

  async getAllTechInfo() {
    try {
      const response = [];
      const docRef = await admin
        .firestore()
        .collection('tkd_belttest_progress');

      await docRef.get().then(async (result) => {
        result.forEach((doc) => {
          response.push(doc.data());
        });
      });

      const TechInfo = {
        lilInfo: await this.getLilTechInfo(),
        advInfo: await this.getAdvTechInfo(),
      };
      return { TechInfo, response };
    } catch (error) {
      console.error(error);
    }
  }

  async getClassStamps() {
    try {
      const response = [];
      let TechInfo = null;
      const docRef = await admin
        .firestore()
        .collection('last_class_time_stamp');
      await docRef.get().then(async (result) => {
        result.forEach((doc) => {
          response.push(doc.data());
        });
      });
      TechInfo = {
        lilInfo: await this.getLilTechInfo(),
        advInfo: await this.getAdvTechInfo(),
      };
      return { classStamp: response, TechInfo: TechInfo };
    } catch (error) {
      console.log('An error occurred fetching class stamps: ', error);
      return error;
    }
  }

  async getTestList() {
    try {
      const response = [];
      const docRef = await admin.firestore().collection('test_ready');
      await docRef.get().then(async (result) => {
        result.forEach((doc) => {
          response.push(doc.data());
        });
      });
      return { TestList: response };
    } catch (error) {
      console.log('An error occurred fetching test list: ', error);
      return error;
    }
  }

  async getLilTechInfo() {
    try {
      const formsResponse = [];
      const handAtksResponse = [];
      const blocksResponse = [];
      const kicksResponse = [];
      const formsDocRef = await admin
        .firestore()
        .collection('lil_formstid_info');
      const handAtksDocRef = await admin
        .firestore()
        .collection('lil_handatkstid_info');
      const blocksDocRef = await admin
        .firestore()
        .collection('lil_blockstid_info');
      const kicksDocRef = await admin
        .firestore()
        .collection('lil_kickstid_info');

      await formsDocRef.get().then(async (result) => {
        result.forEach((doc) => {
          formsResponse.push(doc.data());
        });
      });

      await handAtksDocRef.get().then(async (result) => {
        result.forEach((doc) => {
          handAtksResponse.push(doc.data());
        });
      });

      await blocksDocRef.get().then(async (result) => {
        result.forEach((doc) => {
          blocksResponse.push(doc.data());
        });
      });

      await kicksDocRef.get().then(async (result) => {
        result.forEach((doc) => {
          kicksResponse.push(doc.data());
        });
      });
      return {
        forms: formsResponse,
        handAtks: handAtksResponse,
        blocks: blocksResponse,
        kicks: kicksResponse,
      };
    } catch (error) {
      console.log('An error occurred fetching class stamps: ', error);
      return error;
    }
  }

  async getAdvTechInfo() {
    try {
      const formsResponse = [];
      const handAtksResponse = [];
      const blocksResponse = [];
      const kicksResponse = [];
      const formsDocRef = await admin
        .firestore()
        .collection('adv_formstid_info');
      const handAtksDocRef = await admin
        .firestore()
        .collection('adv_handatkstid_info');
      const blocksDocRef = await admin
        .firestore()
        .collection('adv_blockstid_info');
      const kicksDocRef = await admin
        .firestore()
        .collection('adv_kickstid_info');

      await formsDocRef.get().then(async (result) => {
        result.forEach((doc) => {
          formsResponse.push(doc.data());
        });
      });

      await handAtksDocRef.get().then(async (result) => {
        result.forEach((doc) => {
          handAtksResponse.push(doc.data());
        });
      });

      await blocksDocRef.get().then(async (result) => {
        result.forEach((doc) => {
          blocksResponse.push(doc.data());
        });
      });

      await kicksDocRef.get().then(async (result) => {
        result.forEach((doc) => {
          kicksResponse.push(doc.data());
        });
      });
      return {
        forms: formsResponse,
        handAtks: handAtksResponse,
        blocks: blocksResponse,
        kicks: kicksResponse,
      };
    } catch (error) {
      console.log('An error occurred fetching class stamps: ', error);
      return error;
    }
  }

  async update(updateClassInProgress: any) {
    try {
      const docRef = await admin
        .firestore()
        .collection('tkd_belttest_progress');

      updateClassInProgress.forEach((client) => {
        docRef.doc(client.ClientID).update(client);
      });
      return { updateStatus: true };
    } catch (error) {
      console.log('An error occurred update client progress: ', error);
      return { updateStatus: false, error };
    }
  }

  async updateStudentReady(data: any) {
    try {
      const docRef = await admin.firestore().collection('test_ready');

      switch (data.readyField) {
        case 'FormsRdy': {
          docRef.doc(data.ClientID).update({ FormsRdy: data.isReady });
          break;
        }
        case 'BlocksRdy': {
          docRef.doc(data.ClientID).update({ BlocksRdy: data.isReady });
          break;
        }
        case 'HandAtksRdy': {
          docRef.doc(data.ClientID).update({ HandAtksRdy: data.isReady });
          break;
        }
        case 'KicksRdy': {
          docRef.doc(data.ClientID).update({ KicksRdy: data.isReady });
          break;
        }
      }
      return { status: 'success' };
    } catch (error) {
      console.log('An error occurred updating student readiness: ', error);
      return { status: error };
    }
  }

  async updateStudentClass(data: any) {
    try {
      const docStampRef = await admin
        .firestore()
        .collection('last_class_time_stamp');

      const docRef = await admin
        .firestore()
        .collection('tkd_belttest_progress');
      data.class.forEach((student) => {
        docRef.doc(student.ClientID).update(student);
      });
      this.updateAttendance(data.class, data.classTime);
      docStampRef.doc(data.classID).update(data.stampClass);
      return { status: 'success' };
    } catch (error) {
      console.log('An error occurred updating student readiness: ', error);
      return { status: error };
    }
  }

  async updateAttendance(attendanceList: any, date: string) {
    try {
      const allClients = [];
      const updatedClients = [];
      const docRef = await admin.firestore().collection('tkd_schedule_info');
      await docRef.get().then((result) => {
        result.forEach((doc) => {
          allClients.push(doc.data());
        });
      });

      attendanceList.forEach(async (client) => {
        const clientIndex = allClients.findIndex(
          (cl) => cl.ClientID === client.ClientID,
        );
        if (
          allClients[clientIndex].Attendance[
            allClients[clientIndex].Attendance.length - 1
          ].date != date
        ) {
          allClients[clientIndex].Attendance.push({
            date: date,
          });
          allClients[clientIndex].Attendance.shift();
          updatedClients.push(allClients[clientIndex]);
        }
      });
      if (updatedClients.length > 0) {
        updatedClients.forEach((data) => {
          docRef.doc(data.ClientID).update(data);
        });
      }
      return { updatedClients: updatedClients };
    } catch (error) {
      console.log('An error occurred while updating attendance', error);
    }
  }

  async emailSentFlag(data: any) {
    try {
      // docRef.doc(data.ClientID).update({ FormsRdy: data.isReady });

      await admin
        .firestore()
        .collection('test_ready')
        .doc(data.ClientID)
        .update({ emailSent: data.emailSent });

      return { message: 'Successfully updated Client' };
    } catch (error) {
      console.error(error);
      return {
        message: 'An error occured during the update of the `emailSent` flag',
        error: error,
      };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} classInProgress`;
  }
}
