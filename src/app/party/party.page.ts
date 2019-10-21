import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Party } from '../party.model';
import { CrudService } from './../service/crud.service';
import { Account } from '../account.model';
import { DataService } from '../service/data.service';
import { ToastController } from '@ionic/angular';

@Component({
  templateUrl: 'party.page.html'
})
export class PartyPage implements OnInit {
  account: Account;

  party: Party =
  {
    address: null,
    invitees: [''],
    description: null,
    startTime: null,
    endTime: null,
  };

  constructor(private dataService: DataService, private crudService: CrudService, public toastController: ToastController) {
    this.account = dataService.getAccountData();
    this.party.address = this.account.address;
  }

  async CreatePartyRecord() {
    // tslint:disable-next-line: prefer-const
    let record = this.party;
    if (record.address == null || record.description == null || record.startTime == null || record.endTime == null) {
      this.presentToast(false);
    } else {
      record.startTime = new Date(this.party.startTime);
      record.endTime = new Date(this.party.endTime);
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
}
