import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Party } from '../party.model';
import { Account } from '../account.model';
import { platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

@Injectable({
  providedIn: 'root'
})

export class CrudService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  /**
   * Creates a new user document in the database. Document ID is uid assigned by firebase authentication
   */
  createNewUser(uid, record, afAuth: AngularFireAuth) {
    afAuth.auth.currentUser.sendEmailVerification();
    return this.firestore.collection('users').doc(uid).set(record);
  }

  /**
   * Returns the account information for the user with the given uid. Creates new user doc if one doesn't exist yet
   */
  getUserAccount(afAuth: AngularFireAuth): Account {
    const uid = afAuth.auth.currentUser.uid;
    const account: Account = {
      uid,
      email: afAuth.auth.currentUser.email,
      name: afAuth.auth.currentUser.displayName,
      houseOwner: false,
      address: ''
    };
    this.firestore.collection('users').doc(uid).ref.get().then(doc => {
      // If no document exists in database for the current user, create one
      if (!doc.exists) {
        this.createNewUser(uid, account, afAuth).then(resp => {
          console.log(resp);
        })
        .catch(error => {
          console.log(error);
        });
      } else {
        account.email = doc.get('email');
        account.name = doc.get('name');
        account.houseOwner = doc.get('houseOwner');
        account.address = doc.get('address');
        return account;
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
    return account;
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

  /**
   * Returns an array of parties that the user with the given email address is invited to
   */
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
            openParty: doc.get('openParty'),
            createdBy: doc.get('createdBy')
          };
          parties.push(invite);
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
    return parties;
  }

  /**
   * Returns an array of parties that the user, with the given uid, created
   */
  getPartyCreatedByUser(uid: string): Party[] {
    const parties: Party[] = [];
    const col = this.firestore.collection('events');
    const query = col.ref.where('createdBy', '==', uid);
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
            invitees: doc.get('invitees'),
            openParty: doc.get('openParty'),
            createdBy: doc.get('createdBy')
          };
          parties.push(invite);
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
    return parties;
  }

  /**
   * Returns an array of all open parties
   */
  getOpenParties(): Party[] {
    const parties: Party[] = [];
    const col = this.firestore.collection('events');
    const query = col.ref.where('openParty', '==', true);
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
            openParty: doc.get('openParty'),
            createdBy: doc.get('createdBy')
          };
        parties.push(invite);
      });
    });
    return parties;
  }

  /**
   * Adds user to invitee list for open party
   */
  rsvpOpenParty(selectedParty: Party, email: string): boolean {
    const col = this.firestore.collection('events');
    const query = col.ref.where('openParty', '==', true);
    query.get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
      }
      snapshot.forEach(doc => {
        const event: any = doc.data();
        const id = doc.id;
        if (selectedParty.address === event.address && selectedParty.description === event.description) {
          if (!event.invitees.includes(email)) {
            event.invitees = event.invitees.concat(email);
            const record = {};
            // tslint:disable-next-line: no-string-literal
            record['invitees'] = event.invitees;
            this.updateParty(id, record);
            return true;
          }
        }
      });
    });
    return false;
  }
}
