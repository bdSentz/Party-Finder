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
import { firestore } from 'firebase';



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
    openParty: null
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
    
    constructor(private db: AngularFirestore,public afAuth: AngularFireAuth, private crudService: CrudService,public toastController: ToastController, private dataService: DataService, private helper: HelperService) {
    this.account.email = this.afAuth.auth.currentUser.email;
    this.parties = this.crudService.getOpenParties(this.account.email);
    console.log(this.parties);
  }
 
  joinParty(description) {
    this.presentToast();
    this.selectedParty.description = description;
    this.db.collection(`events`).snapshotChanges().subscribe(colSnap => {
      colSnap.forEach(snap => {
        let event:any = snap.payload.doc.data();
        event.id = snap.payload.doc.id;
        event.description = event.description;
        for(let parties of this.parties){
          if (event.description == parties.description) {
            if(event.openParty == true){
              event.invitees = event.invitees.concat(this.account.email);
              this.selectedParty = event;
              
              console.log(this.selectedParty);
              console.log(event);

            }
          }
        }
      });
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'You are now able to go to this party!',
      duration: 2000
    });
    toast.present();
  }
}