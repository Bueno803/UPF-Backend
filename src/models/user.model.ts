// import { Collection } from "fireorm";



export default class Passenger {
// id: string;
uid: string;
email: string;
phoneNumber: string;
displayName: string
isActive: boolean;
creationTime: Date;
lastLoggedIn: Date;

constructor(uid: string, email: string, phoneNumber: string, displayName: string, isActive: boolean, creationTime: Date, lastLoggedIn: Date) {
    // this.id = id;
    this.uid = uid;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.displayName = displayName;
    this.isActive = isActive;
    this.creationTime = creationTime;
    this.lastLoggedIn = lastLoggedIn;
}
}