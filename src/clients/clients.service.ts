import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class ClientsService {

    constructor() {}

    async createClient(clientInfo: any): Promise<any> {
        // check user existence?
        try {
            const docRef = await admin.firestore().collection('upf-db').doc('client_space');
            await docRef.get().then(async (clients) => {
                clients.data().data.forEach((client) => {
                    if(clientInfo.firstname == client.FirstName && clientInfo.lastname == client.LastName) {
                        return {resData: 'user exists', client: client}
                    }
                    console.log("individual clients: ", client);
                })
                // console.log("3 ", clients.data().data[0]);
                // console.log("1 ", clients);
                await docRef.set(clientInfo).then(() => {
                    return { resData: 'success'};
                })
            })
        } catch (error) {
            console.log("An error occured creating client: ", error);
        }
    }
}
