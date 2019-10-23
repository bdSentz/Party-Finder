import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { Party } from '../party.model';
import { CrudService } from '../service/crud.service';
import { HelperService } from '../service/helper.service';
import { DataService } from '../service/data.service';
import { ToastController } from '@ionic/angular';
import { Account } from '../account.model';


@Component({
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss'],
})
export class ListPage {

    account: Account = 
    {
        uid: '',
        email: '',
        name: '',
        houseOwner: false,
        address: ''
      };
      parties: Party[];
    
    constructor(public afAuth: AngularFireAuth, private crudService: CrudService,public toastController: ToastController, private dataService: DataService) {
    this.account.email = this.afAuth.auth.currentUser.email;
    this.parties = this.crudService.getPartyForUser(this.account.email);
  }
 
  

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'You are now RSVPD!',
      duration: 2000
    });
    toast.present();
  }
}