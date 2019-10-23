import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Party } from '../party.model';

@Injectable({
  providedIn: 'root'
})

export class CrudService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  createNewUser(uid, record) {
    return this.firestore.collection('users').doc(uid).set(record);
  }

  getUserDocument(uid) {
    return this.firestore.collection('users').doc(uid).ref;
  }

  updateUser(recordID, record) {
    this.firestore.doc('users/' + recordID).update(record);
  }

  deleteUser(recordID) {
    this.firestore.doc('users/' + recordID).delete();
  }

  createNewParty(record) {
    return this.firestore.collection('events').add(record);
  }

  updateParty(recordID, record) {
    this.firestore.doc('events/' + recordID).update(record);
  }

  deleteParty(recordID) {
    this.firestore.doc('events/' + recordID).delete();
  }

  getPartyForUser(userEmail): Party[] {
    const parties: Party[] = [];
    this.firestore.collection('events').ref.get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
      }
      let counter = 0;
      snapshot.forEach(doc => {
        counter++;
        if (doc.get('invitees') === userEmail) {
          const invite: Party = {
            address: doc.get('address'),
            description: doc.get('description'),
            startTime: doc.get('startTime').toDate(),
            endTime: doc.get('endTime').toDate(),
            invitees: [],
            partyType: doc.get('partyType')
          };
          parties.push(invite);
        }
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
    return parties;
  }

  getOpenParties(): Party[] {
    const parties: Party[] = [];
    this.firestore.collection('events').ref.get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
      }
      let counter = 0;
      snapshot.forEach(doc => {
        counter++;
        if (doc.get('partyType') === true) {
          const invite: Party = {
            address: doc.get('address'),
            description: doc.get('description'),
            startTime: doc.get('startTime').toDate(),
            endTime: doc.get('endTime').toDate(),
            invitees: [],
            partyType: doc.get('partyType')
          };
          parties.push(invite);
        }
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
    return parties;
  }
}
