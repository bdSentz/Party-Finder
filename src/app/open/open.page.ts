import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { Party } from '../party.model';
import { CrudService } from '../service/crud.service';
import { HelperService } from '../service/helper.service';
import { DataService } from '../service/data.service';
import { ToastController } from '@ionic/angular';
import { Account } from '../account.model';
import { PartyPage } from '../party/party.page';


@Component({
  templateUrl: 'open.page.html',
  styleUrls: ['open.page.scss'],
})
export class OpenPage {

  selectedParty: Party = 
  {
    address: null,
    invitees: [''],
    description: null,
    startTime: null,
    endTime: null,
    partyType: null
  }
    account: Account = 
    {
        uid: '',
        email: '',
        name: '',
        houseOwner: false,
        address: ''
      };
      parties: Party[];
    
    constructor(public afAuth: AngularFireAuth, private crudService: CrudService,public toastController: ToastController, private dataService: DataService, private helper: HelperService) {
    this.account.email = this.afAuth.auth.currentUser.email;
    this.parties = this.crudService.getOpenParties(this.account.email);
    console.log(this.parties);
  }
 
  joinParty() {
    this.presentToast();
    let record = {};
  //find which party was selected
    // tslint:disable-next-line: no-string-literal
    record['invitees'] = this.account.email;
    this.selectedParty;
    this.crudService.updateParty(this.account.uid, record);
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'You are now able to go to this party!',
      duration: 2000
    });
    toast.present();
  }
}