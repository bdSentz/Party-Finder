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
  account: Account;

  constructor(public afAuth: AngularFireAuth, private crudService: CrudService, private dataService: DataService) {
    this.account = dataService.getAccountData();
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      location.reload();
    });
  }

  reload() {
    window.location.reload();
  }

  /*
  RemoveRecord(rowID) {
    this.crudService.deleteUser(rowID);
  }*/

  // Called when user saves info. Updates address and house ownership status associated with account
  UpdateRecord() {
    let record = {};
    // tslint:disable-next-line: no-string-literal
    record['address'] = this.account.address;
    // tslint:disable-next-line: no-string-literal
    record['houseOwner'] = this.account.houseOwner;
    this.crudService.updateUser(this.account.uid, record);
  }
}
