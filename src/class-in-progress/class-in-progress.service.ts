import { Injectable } from '@nestjs/common';
// import { CreateClassInProgressDto } from './dto/create-class-in-progress.dto';
// import { UpdateClassInProgressDto } from './dto/update-class-in-progress.dto';
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
      console.log('TechInfo ', TechInfo);
      return { classStamp: response, TechInfo: TechInfo };
    } catch (error) {
      console.log('An error occurred fetching class stamps: ', error);
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
        console.log('result ', result);
        result.forEach((doc) => {
          console.log('doc ', doc);
          formsResponse.push(doc.data());
        });
      });

      await handAtksDocRef.get().then(async (result) => {
        console.log('result ', result);
        result.forEach((doc) => {
          console.log('doc ', doc);
          handAtksResponse.push(doc.data());
        });
      });

      await blocksDocRef.get().then(async (result) => {
        console.log('result ', result);
        result.forEach((doc) => {
          console.log('doc ', doc);
          blocksResponse.push(doc.data());
        });
      });

      await kicksDocRef.get().then(async (result) => {
        console.log('result ', result);
        result.forEach((doc) => {
          console.log('doc ', doc);
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
        console.log('result ', result);
        result.forEach((doc) => {
          console.log('doc ', doc);
          formsResponse.push(doc.data());
        });
      });

      await handAtksDocRef.get().then(async (result) => {
        console.log('result ', result);
        result.forEach((doc) => {
          console.log('doc ', doc);
          handAtksResponse.push(doc.data());
        });
      });

      await blocksDocRef.get().then(async (result) => {
        console.log('result ', result);
        result.forEach((doc) => {
          console.log('doc ', doc);
          blocksResponse.push(doc.data());
        });
      });

      await kicksDocRef.get().then(async (result) => {
        console.log('result ', result);
        result.forEach((doc) => {
          console.log('doc ', doc);
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
        case 'KickssRdy': {
          docRef.doc(data.ClientID).update({ KickssRdy: data.isReady });
          break;
        }
      }
      return { status: 'success' };
    } catch (error) {
      console.log('An error occurred updating student readiness: ', error);
      return { status: error };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} classInProgress`;
  }
}
