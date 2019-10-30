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

  getPartyForUser(userEmail: string): Party[] {
    const parties: Party[] = [];
    const col = this.firestore.collection('events');
    const query = col.ref.where('invitees', 'array-contains', {value: userEmail});
    query.get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
      }
      snapshot.forEach(doc => {
          const invite: Party = {
            address: doc.get('address'),
            description: doc.get('description'),
            startTime: doc.get('startTime').toDate(),
            endTime: doc.get('endTime').toDate(),
            invitees: [],
            openParty: doc.get('openParty')
          };
          parties.push(invite);
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
    return parties;
  }

  getOpenParties(userEmail): Party[] {
    const parties: Party[] = [];
    this.firestore.collection('events').ref.get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
      }
      let counter = 0;
      snapshot.forEach(doc => {
        counter++;
        if (doc.get('openParty') === true) {
          const invite: Party = {
            address: doc.get('address'),
            description: doc.get('description'),
            startTime: doc.get('startTime').toDate(),
            endTime: doc.get('endTime').toDate(),
            invitees: doc.get('invitees'),
            openParty: doc.get('openParty')
          };
          if(invite.invitees.includes(userEmail)){
            console.log('already invited');
          }
          else{
            parties.push(invite);
          }
          
        }
      });
    })
    
    .catch(err => {
      console.log('Error getting documents', err);
    });
    return parties;
  }
}
