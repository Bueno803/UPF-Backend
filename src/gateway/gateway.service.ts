import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class GatewayService {
  constructor() {}

  async verifyEmail(userEmail: { email: string }) {
    try {
      // Reference to the 'Users' collection
      const adminUsersRef = admin.firestore().collection('Users');

      // Query 'Users' collection for a document with a matching email
      const usersQuerySnapshot = await adminUsersRef
        .where('email', '==', userEmail.email)
        .limit(1)
        .get();
      if (!usersQuerySnapshot.empty) {
        // Email found in 'Users' collection, return the first matching document's data
        return usersQuerySnapshot.docs[0].data();
      }

      // Reference to the 'client_space' collection
      const clientSpaceRef = admin.firestore().collection('client_space');

      // Query 'client_space' collection for a document with a matching email
      const clientSpaceQuerySnapshot = await clientSpaceRef
        .where('Email', '==', userEmail.email)
        .limit(1)
        .get();
      if (!clientSpaceQuerySnapshot.empty) {
        // Email found in 'client_space' collection, return the first matching document's data
        return clientSpaceQuerySnapshot.docs[0].data();
      }

      // Email not found in either collection
      return null;
    } catch (error) {
      console.error('Error verifying email:', error);
      throw new Error('Failed to verify email');
    }
  }
}
