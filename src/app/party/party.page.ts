import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  templateUrl: 'party.page.html'
})
export class PartyPage implements OnInit {

  hasVerifiedEmail = true;
  sentTimestamp;

  constructor(public afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.hasVerifiedEmail = this.afAuth.auth.currentUser.emailVerified;
      }
    });
  }

  ngOnInit() {
  }
}
