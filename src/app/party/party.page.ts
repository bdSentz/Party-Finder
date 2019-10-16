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
  account: Account;

  party: Party =
  {
    address: '',
    invitees: [''],
    description: '',
    startTime: '',
    endTime: '',
    startDate: '',
  };

  constructor(private dataService: DataService, private crudService: CrudService) {
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
