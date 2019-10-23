import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { Account } from '../account.model';
import { AngularFireAuth } from '@angular/fire/auth';

import { CrudService } from './../service/crud.service';
import { DataService } from './../service/data.service';
import { HelperService } from './../service/helper.service';
import { Party } from '../party.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  account: Account =
  {
    uid: '',
    email: '',
    name: '',
    houseOwner: false,
    address: ''
  };

  parties: Party[];

  // tslint:disable-next-line: max-line-length
  constructor(public toastController: ToastController, public afAuth: AngularFireAuth, private crudService: CrudService, private dataService: DataService, public helper: HelperService) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.account.email = this.afAuth.auth.currentUser.email;
        this.account.name = this.afAuth.auth.currentUser.displayName;
        this.account.uid = this.afAuth.auth.currentUser.uid;
        this.parties = this.crudService.getPartyForUser(this.account.email);
      }
      // Get account data from database for current user if it exists. If not create database document for the user
      this.getUserInfo();
    });
    // Set singleton account value so other pages can access account data
    dataService.setAccountData(this.account);
  }

  getUserInfo() {
    const userDocumentRef = this.crudService.getUserDocument(this.account.uid);
    const getDoc = userDocumentRef.get().then(doc => {
      // If no document exists in database for the current user, create one
      if (!doc.exists) {
        this.crudService.createNewUser(this.account.uid, this.account).then(resp => {
          this.afAuth.auth.currentUser.sendEmailVerification();
          this.account.address = '';
          console.log(resp);
        })
        .catch(error => {
          console.log(error);
        });
      } else {
        this.account.houseOwner = doc.get('HouseOwner');
        this.account.address = doc.get('Address');
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'You have accepted the invite!',
      duration: 2000
    });
    toast.present();
  }
}
