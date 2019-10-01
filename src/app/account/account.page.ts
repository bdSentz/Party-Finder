import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { Account } from './account.model';

@Component({
    selector: 'app-account',
    templateUrl: 'account.page.html',
    styleUrls: ['account.page.scss'],
})
export class AccountPage implements OnInit {

  hasVerifiedEmail = true;
  sentTimestamp;

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

  constructor(public afAuth: AngularFireAuth) {
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
  }
}
