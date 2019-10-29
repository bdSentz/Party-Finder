import { Injectable } from '@angular/core';
import { Account } from '../account.model';
import { Party } from '../party.model';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  private data = [];

  constructor() { }

  setData(id, data) {
    this.data[id] = data;
  }

  getData(id) {
    return this.data[id];
  }

  setAccountData(data: Account) {
    this.setData('Account', data);
  }

  getAccountData(): Account {
    // tslint:disable-next-line: no-string-literal
    return this.getData('Account');
  }

  setPartyData(data: Party[]) {
    this.setData('Party', data);
  }

  getPartyData(): Party[] {
    // tslint:disable-next-line: no-string-literal
    return this.getData('Party');
  }
}
