import { Component, OnInit } from '@angular/core';
import {Account} from './account.model';
@Component({
    selector: 'app-account',
    templateUrl: 'account.page.html',
    styleUrls: ['account.page.scss'],
})
export class AccountPage implements OnInit {
    account: Account = {
        email: 'jdoe@ycp.edu',
        name: 'John Doe',
        userName: 'Jdoe123',
        ID: 903054343,
        year: 'Senior',
        houseOwner: true,
        address: '267 West Jackson Street, York PA',
    }
  constructor() {}

  ngOnInit() {
  }
}
