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
      joinableParties: Party[];
      joinedParties: Party[];

    constructor(private db: AngularFirestore,public afAuth: AngularFireAuth, private crudService: CrudService,public toastController: ToastController, private dataService: DataService, private helper: HelperService) {
    this.account.email = this.afAuth.auth.currentUser.email;
    this.joinableParties = this.crudService.getOpenParties();
    console.log(this.joinableParties);
  }
 
  joinParty(description) {
    this.presentToast();
    this.selectedParty.description = description;
    this.db.collection(`events`).snapshotChanges().subscribe(colSnap => {
      colSnap.forEach(snap => {
        let event:any = snap.payload.doc.data();
        event.id = snap.payload.doc.id;
        event.description = event.description;
        for(let parties of this.joinableParties){
          if (event.description == parties.description) {
            if((event.openParty == true) && !(event.invitees.includes(this.account.email))){
              event.invitees = event.invitees.concat(this.account.email);
              this.selectedParty = event;
              this.rsvp(event.id);
              console.log(event.id);
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
      message: 'You are now RSVPD!',
      duration: 2000
    });
    toast.present();
  }

  rsvp(id) {
    let record = {};
     // tslint:disable-next-line: no-string-literal
     record['invitees'] = this.selectedParty.invitees;
     this.crudService.updateParty(id, record);
  }
}

