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
    openParty: null,
    createdBy: null,
    partyID: null
  };
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
  joinableParties: Party[];
  joinedParties: Party[];
  // tslint:disable-next-line: max-line-length
  constructor(private db: AngularFirestore, public afAuth: AngularFireAuth, private crudService: CrudService, public toastController: ToastController, private dataService: DataService, public helper: HelperService) {
    this.account.email = this.afAuth.auth.currentUser.email;
    this.joinableParties = this.crudService.getOpenParties();    
  }

  joinParty(party: Party) {
    console.log(party.invitees);
    if (this.crudService.rsvpOpenParty(party, this.account.email)) {
      this.presentToast();
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'You are now RSVPD!',
      duration: 2000
    });
    toast.present();
  }
}

