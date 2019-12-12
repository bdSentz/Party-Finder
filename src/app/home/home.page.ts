import { Component, OnInit } from '@angular/core';
import { ToastController, NavController, AlertController } from '@ionic/angular';

import { Account } from '../account.model';
import { AngularFireAuth } from '@angular/fire/auth';

import { CrudService } from './../service/crud.service';
import { DataService } from './../service/data.service';
import { HelperService } from './../service/helper.service';
import { Party } from '../party.model';
import { Router, NavigationExtras } from '@angular/router';

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
    address: '',
    groups: []
  };

  parties: Party[];

  // tslint:disable-next-line: max-line-length
  constructor(public toastController: ToastController, private router: Router, public afAuth: AngularFireAuth, private crudService: CrudService, private dataService: DataService, public helper: HelperService, public navCtrl: NavController, private alertCtrl: AlertController) {
    afAuth.authState.subscribe(user => {
      if (user) {
        this.account = helper.getAccount(afAuth, dataService, crudService);
        this.parties = helper.getParties(afAuth, dataService, crudService);
      }
    });
  }

  /**
   * Refreshes parties that user has been invited to by pulling down on home screen
   */
  async doRefresh(event) {
    this.parties = await this.crudService.getPartyForUser(this.afAuth.auth.currentUser.email);
    this.dataService.setPartyData(this.parties);
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  async presentToast(bool: boolean, party: Party) {
    if (bool) {
      const toast = await this.toastController.create({
        message: 'You have accepted the invite!',
        duration: 2000
      });
      toast.present();
      this.go(party.address);
    } else {
      const alert = this.alertCtrl.create({
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

  go(partyLocation: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        location: partyLocation
      }
    };
    console.log(partyLocation);
    this.router.navigate(['map'], navigationExtras);
  }
}
