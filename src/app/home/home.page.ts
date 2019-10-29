import { Component, OnInit } from '@angular/core';
import { ToastController, NavController, AlertController } from '@ionic/angular';

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
  constructor(public toastController: ToastController, public afAuth: AngularFireAuth, private crudService: CrudService, private dataService: DataService, public helper: HelperService, public navCtrl: NavController, private alertCtrl: AlertController) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // Get account data from database for current user if it exists. If not create database document for the user
        this.account = this.crudService.getUserAccount(afAuth);
        this.parties = this.crudService.getPartyForUser(this.account.email);
        // Set singleton account value so other pages can access account data
        dataService.setAccountData(this.account);
      }
    });
  }

  async presentToast(bool: boolean, party: Party) {
    if (bool) {
      const toast = await this.toastController.create({
        message: 'You have accepted the invite!',
        duration: 2000
      });
      toast.present();
    } else {
      const alert = this.alertCtrl.create({
        // title: 'Decline Invite',
        message: 'Are you sure you would like to decline this invite?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
            }
          },
          {
            text: 'Remove Invite',
            handler: async () => {
              const toast = await this.toastController.create({
                message: 'You have declined the invite.',
                duration: 2000
              });
              toast.present();
            }
          }
        ]
      });
      (await alert).present();
    }
  }
}
