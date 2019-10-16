import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { Account } from '../account.model';

import { CrudService } from './../service/crud.service';
import { DataService } from './../service/data.service';

@Component({
    selector: 'app-account',
    templateUrl: 'account.page.html',
    styleUrls: ['account.page.scss'],
})
export class AccountPage {

  hasVerifiedEmail = true;
  sentTimestamp;

  account: Account =
  {
    uid: '',
    email: '',
    name: '',
    houseOwner: false,
    address: '',
  };

  constructor(public afAuth: AngularFireAuth, private crudService: CrudService, private dataService: DataService) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.hasVerifiedEmail = this.afAuth.auth.currentUser.emailVerified;
        this.account.email = this.afAuth.auth.currentUser.email;
        this.account.name = this.afAuth.auth.currentUser.displayName;
        this.account.uid = this.afAuth.auth.currentUser.uid;
      }
      this.getUserInfo();
    });
    dataService.setAccountData(this.account);
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      location.reload();
    });
  }

  reload() {
    window.location.reload();
  }

  getUserInfo() {
    const userDocumentRef = this.crudService.getUserDocument(this.account.uid);
    const getDoc = userDocumentRef.get().then(doc => {
      if (!doc.exists) {
        console.log('No Doc exists');
        this.CreateRecord();
      } else {
        this.account.houseOwner = doc.get('HouseOwner');
        this.account.address = doc.get('Address');
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
  }

  CreateRecord() {
    // tslint:disable-next-line: prefer-const
    let record = {};
    // tslint:disable-next-line: no-string-literal
    record['Name'] = this.account.name;
    // tslint:disable-next-line: no-string-literal
    record['Email'] = this.account.email;
    // tslint:disable-next-line: no-string-literal
    record['Address'] = this.account.address;
    // tslint:disable-next-line: no-string-literal
    record['HouseOwner'] = this.account.houseOwner;
    this.crudService.createNewUser(this.account.uid, record).then(resp => {
      this.account.address = '';
      console.log(resp);
    })
    .catch(error => {
      console.log(error);
    });
  }

  RemoveRecord(rowID) {
    this.crudService.deleteUser(rowID);
  }

  EditRecord(record) {
    record.isEdit = true;
    record.EditName = record.Name;
    record.EditAge = record.Age;
    record.EditAddress = record.Address;
  }

  UpdateRecord() {
    // tslint:disable-next-line: prefer-const
    let record = {};
    // tslint:disable-next-line: no-string-literal
    record['Address'] = this.account.address;
    // tslint:disable-next-line: no-string-literal
    record['HouseOwner'] = this.account.houseOwner;
    this.crudService.updateUser(this.account.uid, record);
  }
}
