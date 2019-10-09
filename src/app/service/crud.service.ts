import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';

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
}
