import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Party } from '../party.model';
import { PartyPageModule } from '../party/party.module';

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
    let parties: Party[] = [];
    this.firestore.collection('events', ref => ref.where('invitees', '==', userEmail)).ref.get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
      }
      let counter = 0;
      snapshot.forEach(doc => {
        counter++;
        let invite: Party = {
          address: doc.get('Address'),
          description: doc.get('Description'),
          startTime: doc.get('startTime'),
          endTime: doc.get('endTime'),
          startDate: doc.get('startDate'),
          invitees: []
        };
        parties.push(invite);
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
    return parties;
  }

  /*
  formatDate(date: Date): string {
    const day = date.getDate;
    const month = date.getMonth;
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }*/
}
