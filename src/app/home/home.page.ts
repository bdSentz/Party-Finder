import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { Invite } from './invite.model';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  invites: Invite[] = [
    {
      date: 'September, 20',
      time: '9:00 P.M.',
      location: '241 West Jackson Street, York PA',
      partyType: 'Open, BYOB',
      partyDescription: 'Party come through! Bring your friends'
    },
    {
      date: 'September, 21',
      time: '10:00 P.M.',
      location: '267 West Jackson Street, York PA',
      partyType: 'Mixer',
      partyDescription: 'Party come through! Bring your friends'
    },
    {
      date: 'September, 22',
      time: '11:00 P.M.',
      location: '290 West Jackson Street, York PA',
      partyType: 'Invite Only',
      partyDescription: 'Party come through! Bring your friends'
    }
  ];
  constructor(public toastController: ToastController, public afAuth: AngularFireAuth) {}

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'You have accepted the invite!',
      duration: 2000
    });
    toast.present();
  }
}
