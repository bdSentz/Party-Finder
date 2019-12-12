import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Party } from '../party.model';
import { CrudService } from './../service/crud.service';
import { Account } from '../account.model';
import { DataService } from '../service/data.service';
import { ToastController, AlertController } from '@ionic/angular';
import { HelperService } from '../service/helper.service';

@Component({
  templateUrl: 'party.page.html'
})
export class PartyPage implements OnInit {

  data: any;

  account: Account =
  {
    uid: '',
    email: '',
    name: '',
    houseOwner: false,
    address: '',
    groups: []
  };

  party: Party =
  {
    address: null,
    invitees: [],
    description: null,
    startTime: null,
    endTime: null,
    openParty: false,
    createdBy: null,
    partyID: null
  };

  createdParties: Party[];

  // tslint:disable-next-line: max-line-length
  constructor(public helper: HelperService, private dataService: DataService, public afAuth: AngularFireAuth, private alertCtrl: AlertController, private crudService: CrudService, public toastController: ToastController) {
    afAuth.authState.subscribe(async user => {
      if (user) {
        this.account = helper.getAccount(afAuth, dataService, crudService);
        this.party.address = this.account.address;
        this.createdParties = await helper.getCreatedParties(afAuth, dataService, crudService);
        console.log(this.createdParties);
      }
    });
  }

  /**
   * Does the necessary checks for creating a party. If the checks pass, party is created in the database.
   */
  async CreatePartyRecord() {
    // tslint:disable-next-line: prefer-const
    let record = this.party;
    // tslint:disable-next-line: max-line-length
    if (record.address == null) {
      this.presentToast('No address set for the party.');
    } else if (record.description == null) {
      this.presentToast('The party must have a description.');
    } else if (record.startTime == null || record.endTime == null) {
      this.presentToast('Party must have a start and end time set.');
    } else if (record.openParty === false && record.invitees.length < 1) {
      this.presentToast('Invite only party must have valid invitees. Add invitees or make the party open.');
    } else {
      record.startTime = new Date(this.party.startTime);
      record.endTime = new Date(this.party.endTime);
      record.createdBy = this.afAuth.auth.currentUser.uid;
      this.crudService.createNewParty(record).then(resp => {
        this.presentToast('You successfully created a party!');
        this.reload();
        console.log(resp);
      })
      .catch(error => {
        console.log(error);
      });
    }
  }

  ngOnInit() {
  }

  /**
   * Presents toast giving feedback for creation of a party
   * @param text Sets the text to display depending on whether party was successfully created or not
   */
  async presentToast(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }

  Add() {
    this.party.invitees.push({value: ''});
  }

  Remove(idx) {
    this.party.invitees.splice(idx, 1);
  }

  reload() {
    window.location.reload();
  }

  async deleteParty(partyID: string) {
    const alert = this.alertCtrl.create({
      message: 'Are you sure you would like to delete this invite?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Delete Party',
          handler: async () => {
            this.crudService.deleteParty(partyID);
            const toast = await this.toastController.create({
              message: 'You have deleted the invite.',
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
