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

  remove(id: number) {
    return `This action removes a #${id} classInProgress`;
  }
}
