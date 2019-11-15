import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Party } from '../party.model';
import { CrudService } from './../service/crud.service';
import { Account } from '../account.model';
import { DataService } from '../service/data.service';
import { ToastController } from '@ionic/angular';
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
    address: ''
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
  constructor(public helper: HelperService, private dataService: DataService, public afAuth: AngularFireAuth, private crudService: CrudService, public toastController: ToastController) {
    afAuth.authState.subscribe(async user => {
      if (user) {
        this.account = helper.getAccount(afAuth, dataService, crudService);
        this.party.address = this.account.address;
        this.createdParties = await helper.getCreatedParties(afAuth, dataService, crudService);
        console.log(this.createdParties);
      }
    });
  }

  async CreatePartyRecord() {
    // tslint:disable-next-line: prefer-const
    let record = this.party;
    if (record.address == null || record.description == null || record.startTime == null || record.endTime == null) {
      this.presentToast(false);
    } else {
      record.startTime = new Date(this.party.startTime);
      record.endTime = new Date(this.party.endTime);
      record.createdBy = this.afAuth.auth.currentUser.uid;
      this.crudService.createNewParty(record).then(resp => {
        this.presentToast(true);
        console.log(resp);
      })
      .catch(error => {
        console.log(error);
      });
    }
  }

  ngOnInit() {
  }

  async presentToast(Bool) {
    if (!Bool) {
      const toast = await this.toastController.create({
        message: 'Fill in all necessary fields',
        duration: 2000
      });
      toast.present();
    } else {
      const toast = await this.toastController.create({
        message: 'You successfully created a party!',
        duration: 2000
      });
      toast.present();
    }
  }

  Add() {
    this.party.invitees.push({value: ''});
  }

  Remove(idx) {
    this.party.invitees.splice(idx, 1);
  }

  deleteParty(partyID: string) {
    this.crudService.deleteParty(partyID);
  }
}
