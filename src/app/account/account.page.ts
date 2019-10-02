import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { Account } from './account.model';

import { CrudService } from './../service/crud.service';

@Component({
    selector: 'app-account',
    templateUrl: 'account.page.html',
    styleUrls: ['account.page.scss'],
})
export class AccountPage implements OnInit {

  hasVerifiedEmail = true;
  sentTimestamp;

  users: any;
  userName: string;
  userAddress: string;

  /* Temporary account info until we have functional database*/
  account: Account =
    {
      email: 'fakeemail@gmail.com',
      name: 'Bob',
      userName: 'username',
      ID: 12345,
      year: '2019',
      houseOwner: false,
      address: 'blank'
    };

  constructor(public afAuth: AngularFireAuth, private crudService: CrudService) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.hasVerifiedEmail = this.afAuth.auth.currentUser.emailVerified;
      }
    });
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      location.reload();
    });
  }

  reload() {
    window.location.reload();
  }

  ngOnInit() {
    this.crudService.readUsers().subscribe(data => {
      this.users = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          // tslint:disable-next-line: no-string-literal
          Name: e.payload.doc.data()['Name'],
          // tslint:disable-next-line: no-string-literal
          Address: e.payload.doc.data()['Address'],
        };
      });
      console.log(this.users);
    });
  }

  CreateRecord() {
    // tslint:disable-next-line: prefer-const
    let record = {};
    // tslint:disable-next-line: no-string-literal
    record['Name'] = this.userName;
    // tslint:disable-next-line: no-string-literal
    record['Address'] = this.userAddress;
    this.crudService.createNewUser(record).then(resp => {
      this.userName = '';
      this.userAddress = '';
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

  UpdateRecord(recordRow) {
    // tslint:disable-next-line: prefer-const
    let record = {};
    // tslint:disable-next-line: no-string-literal
    record['Name'] = recordRow.EditName;
    // tslint:disable-next-line: no-string-literal
    record['Address'] = recordRow.EditAddress;
    this.crudService.updateUsers(recordRow.id, record);
    recordRow.isEdit = false;
  }
}
