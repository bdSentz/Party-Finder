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
    description: '',
    startTime: '',
    endTime: '',
    startDate: '',
    title: ''
  };

  constructor(public afAuth: AngularFireAuth, private dataService: DataService, private crudService: CrudService) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.hasVerifiedEmail = this.afAuth.auth.currentUser.emailVerified;
      }
    });
    this.account = dataService.getData('Account');
    this.party.address = this.account.address;
  }

  CreatePartyRecord() {
    // tslint:disable-next-line: prefer-const
    let record = {};
    // tslint:disable-next-line: no-string-literal
    record['Address'] = this.party.address;
    // tslint:disable-next-line: no-string-literal
    record['Invitees'] = this.party.invitees;
    // tslint:disable-next-line: no-string-literal
    record['Description'] = this.party.description;
    // tslint:disable-next-line: no-string-literal
    record['Title'] = this.party.title;
    // tslint:disable-next-line: no-string-literal
    record['startTime'] = new Date(this.party.startTime);
    // tslint:disable-next-line: no-string-literal
    record['endTime'] = new Date(this.party.endTime);
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
