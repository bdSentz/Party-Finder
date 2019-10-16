import { Injectable } from '@angular/core';

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

  setAccountData(data) {
    this.setData('Account', data);
  }

  getAccountData() {
    // tslint:disable-next-line: no-string-literal
    return this.getData('Account');
  }
}
