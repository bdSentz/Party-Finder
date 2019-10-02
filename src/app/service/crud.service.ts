import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class CrudService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  createNewUser(record) {
    return this.firestore.collection('users').add(record);
  }

  readUsers() {
    return this.firestore.collection('users').snapshotChanges();
  }

  updateUsers(recordID, record) {
    this.firestore.doc('users/' + recordID).update(record);
  }

  deleteUser(recordID) {
    this.firestore.doc('users/' + recordID).delete();
  }
}
