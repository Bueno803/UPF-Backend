#!/usr/bin/node
const admin = require('firebase-admin');
var serviceAccount = require("../src/configs/serviceaccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const data = require("../json-to-firestore/clientdata.json");
// {
//     "Tamil Nadu": {
//         "Chennai ": {
//             "Anna Nagar": "600040 ",
//             "New Avadi road": "600010 "
//         },
//         "Tiruvallur ": {
//             "Ambattur": "600053 ",
//             "Mogappair": "600037 "
//         }
//     },
//     "Andhra Pradesh": {
//         "Anantapur ": {
//             "A Narayanapuram": "515001 ",
//             "Achampalle": "515621 "
//         },
//         "Chittoor ": {
//             "Agraharam": "517640 ",
//             "Badikayalapalle": "517370 "
//         }
//     }
// }

for(let i = 0; i < data.length; i++) {
  let tempString = data[i];
  console.log(tempString);
  data[i+1].forEach((client, j) => {
    // console.log(data[i]);
    // console.log((j+1), ' ', client.ClientID);
    // let tempID = client.ClientID;
    // console.log("B4 ", client);
    // let temp2;
    let tempClient = Object.assign({}, client);
    // tempClient.id = j+1;

    // console.log("Clients: ", temMHBpClient);

    // delete tempClient.ClientID;
    console.log((j+1).toString(), ' ', tempClient);
    // console.log("After ", client);
    // console.log(temp2);
    admin.firestore().collection(data[i]).doc((j+1).toString()).set(tempClient);
  })
  i++;
}
// data.forEach((client, i) => {
//   console.log('test ', client[i]);
//   i++;
  // tempString = client;
  // data[i+1].forEach((clientData, j) => {
  // })
  // i++;
  // console.log(i, ' ', client);
  // // console.log(i, ' ', client);
// })

// console.log("data: ", data);
// const promises = [];
// const dataArray = Object.entries(data);
// dataArray.forEach(d => {
//   // console.log("d is: ", d);
//   console.log("d is ", d);
//     //  promises.push(admin.firestore().collection('upf-db').doc(d[1].name).set(d[1]));
// })
// Promise.all(promises);