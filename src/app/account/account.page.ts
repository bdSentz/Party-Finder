import { Component, OnInit } from '@angular/core';
import {Account} from './account.model';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    selector: 'app-account',
    templateUrl: 'account.page.html',
    styleUrls: ['account.page.scss'],
})
export class AccountPage implements OnInit {

  hasVerifiedEmail = true;
  sentTimestamp;

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
