import { Injectable } from '@nestjs/common';
// import { FirebaseModule } from 'src/firebase.module';
// import {  } from 'firebase-admin'
import * as admin from 'firebase-admin';



@Injectable()
export class UsersService {

    constructor() {}

    async getAllUsers() {
        // const firestoreUsers = await admin.firestore().getAll();
        try {
            // const login = await admin.auth().generateSignInWithEmailLink
            const users = await admin.firestore().collection('Users').get().then(snapshot => {
                // https://www.jsowl.com/get-all-documents-from-a-collection-in-a-firestore/
                snapshot.forEach((data) => {
                    console.log(data.id, " : ", data.data());
                })
                const arrayR = snapshot.docs.map(doc => {
                    return doc.data();
                })
                console.log("the array: ", arrayR);
                return arrayR;
            }).catch(function(error) {
                console.log("got an error", error);
            })
            return users;
        } catch (error) {
            console.log(error);
        }
        // getDocs(userCol).then((snapshot) => {
        //     const firestoreUsers = snapshot.docs;
        //     console.log(snapshot.docs);
        //     // const users = await admin.auth().listUsers();
        //     // console.log(users);
            return null;
        // })
    }

    async createUserWithEmailPassword(email: string, phoneNumber: string, password: string) {
        try {
            let returnData;
            await admin.auth().createUser({
                email,
                phoneNumber,
                password
            }).then((userRecord) => {
                // admin.auth().
                
                console.log("new auth user record: ", userRecord);
                
                // admin.auth().generateEmailVerificationLink(userRecord.email).then(function(link) {
                //     // The link was successfully generated.
                //     console.log("success link: ", link);
                //   })
                //   .catch(function(error) {
                //     console.log("error link: ", error);
                //     // Some error occurred, you can inspect the code: error.code
                //   });;
                // userRecord.code = null
                returnData = userRecord; 
            }).catch(async (error) => {
                console.log('Error creating new user: ', await error);
                console.log("get code: ", error.errorInfo.code);
                returnData = error.errorInfo;
                console.log("errorLog: ", returnData);
            });
            return returnData;
        } catch (error) {
            console.log("this sht: ",error); 
            return null;
        }
    }
    
    async createUserInDb(uid: string, email: string, phoneNumber: string, displayName: string, isActive: boolean, creationTime: Date, lastLoggedIn: Date) {
        try {
            let newUser;
            const docRef = await admin.firestore().collection('Users').doc(uid);
            await docRef.get().then(async (aUser) => {
                if(aUser.exists) {
                    console.log("Document data: ", aUser.data());
                    return null;
                } else {
                    console.log("No such document");
                    newUser = {
                        'email': email,
                        'phoneNumber': phoneNumber,
                        'displayName': displayName,
                        'isActive': isActive,
                        'creationTime': creationTime,
                        'lastLoggedIn': lastLoggedIn
                    };
                    await docRef.set(newUser).then(() => {
                        console.log("newUser: ", newUser);
                    })
                }
            })
            return newUser;
            
        } catch (error) {
            console.log(error);
            return null;
        }
        return null;
    }

    async updateUserTimeStamp(uid: string, lastLoggedIn: Date) {
        try {
            const user = await admin.firestore().collection('Users').doc(uid).update({
                'lastLoggedIn': lastLoggedIn
            })
            console.log(user);
            return user;
            
        } catch (error) {
            
        }
    }

    async updateUserPhone(uid: string, phonenumber: string) {
        try {
            const user = await admin.firestore().collection('Users').doc(uid).update({
                'phoneNumber': phonenumber
            })
            console.log("updateUserPhone: ", user);
            return user;
            
        } catch (error) {
            
        }
    }
}
