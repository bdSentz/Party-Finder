import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Account } from '../account.model';
import { CrudService } from './../service/crud.service';
import { DataService } from './../service/data.service';
import { HelperService } from '../service/helper.service';

@Component({
    selector: 'app-account',
    templateUrl: 'account.page.html',
    styleUrls: ['account.page.scss'],
})

export class AccountPage {
  account: Account =
  {
    uid: '',
    email: '',
    name: '',
    houseOwner: false,
    address: '',
    groups: []
  };

  // tslint:disable-next-line: max-line-length
  constructor(public afAuth: AngularFireAuth, public helper: HelperService, private crudService: CrudService, private dataService: DataService) {
    afAuth.authState.subscribe(user => {
      if (user) {
        this.account = helper.getAccount(afAuth, dataService, crudService);
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

  // Called when user saves info. Updates address and house ownership status associated with account
  UpdateRecord() {
    const record = {};
    // tslint:disable-next-line: no-string-literal
    record['address'] = this.account.address;
    // tslint:disable-next-line: no-string-literal
    record['houseOwner'] = this.account.houseOwner;
    // tslint:disable-next-line: no-string-literal
    record['groups'] = this.account.groups;
    this.crudService.updateUser(this.account.uid, record);
  }
  
  leaveGroup(group: string){

  }

}
