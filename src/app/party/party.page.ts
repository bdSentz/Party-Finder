import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Party } from '../party.model';
import { CrudService } from './../service/crud.service';
import { Account } from '../account.model';
import { DataService } from '../service/data.service';

@Component({
  templateUrl: 'party.page.html'
})
export class PartyPage implements OnInit {

  hasVerifiedEmail = true;
  sentTimestamp;
  account: Account;

  party: Party =
  {
    address: '',
    invitees: [''],
    description: ''
  };

  constructor(public afAuth: AngularFireAuth, private dataService: DataService, private crudService: CrudService) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.hasVerifiedEmail = this.afAuth.auth.currentUser.emailVerified;
      }
    });
    this.account = dataService.getAccountData();
    this.party.address = this.account.address;
  }

  CreatePartyRecord() {
    // tslint:disable-next-line: prefer-const
    let record = this.party;
    this.crudService.createNewParty(record).then(resp => {
      console.log(resp);
    })
    .catch(error => {
      console.log(error);
    });
  }

  ngOnInit() {
  }
}
