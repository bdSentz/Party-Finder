import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { Invite } from '../invite.model';
import { Account } from '../account.model';
import { AngularFireAuth } from '@angular/fire/auth';

import { CrudService } from './../service/crud.service';
import { DataService } from './../service/data.service';
import { Party } from '../party.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  hasVerifiedEmail = true;
  sentTimestamp;

  account: Account =
  {
    uid: '',
    email: '',
    name: '',
    houseOwner: false,
    address: '',
  };

  parties: Party[];

  // tslint:disable-next-line: max-line-length
  constructor(public toastController: ToastController, public afAuth: AngularFireAuth, private crudService: CrudService, private dataService: DataService) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.hasVerifiedEmail = this.afAuth.auth.currentUser.emailVerified;
        this.account.email = this.afAuth.auth.currentUser.email;
        this.account.name = this.afAuth.auth.currentUser.displayName;
        this.account.uid = this.afAuth.auth.currentUser.uid;
      }
      this.getUserInfo();
    });
    dataService.setData('Account', this.account);

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.parties = this.crudService.getPartyForUser(this.account.email);
      }
    });
  }

  getUserInfo() {
    const userDocumentRef = this.crudService.getUserDocument(this.account.uid);
    const getDoc = userDocumentRef.get().then(doc => {
      if (!doc.exists) {
        console.log('No Doc exists');
        this.CreateRecord();
      } else {
        this.account.houseOwner = doc.get('HouseOwner');
        this.account.address = doc.get('Address');
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
  }

  CreateRecord() {
    // tslint:disable-next-line: prefer-const
    let record = {};
    // tslint:disable-next-line: no-string-literal
    record['Name'] = this.account.name;
    // tslint:disable-next-line: no-string-literal
    record['Email'] = this.account.email;
    // tslint:disable-next-line: no-string-literal
    record['Address'] = this.account.address;
    // tslint:disable-next-line: no-string-literal
    record['HouseOwner'] = this.account.houseOwner;
    this.crudService.createNewUser(this.account.uid, record).then(resp => {
      this.account.address = '';
      console.log(resp);
    })
    .catch(error => {
      console.log(error);
    });
  }

  sendVerificationEmail() {
    this.afAuth.auth.currentUser.sendEmailVerification();
    this.sentTimestamp = new Date();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'You have accepted the invite!',
      duration: 2000
    });
    toast.present();
  }
}
