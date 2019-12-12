import { Component, OnInit, OnChanges } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Account } from '../account.model';
import { CrudService } from './../service/crud.service';
import { DataService } from './../service/data.service';
import { HelperService } from '../service/helper.service';
import { AngularFirestore} from '@angular/fire/firestore';
import { AccountPage } from '../account/account.page';
import { Group } from '../group.model';
import { ToastController } from '@ionic/angular';
import { Router} from '@angular/router';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';

@Component({
    selector: 'app-editgroup',
    templateUrl: 'editgroup.page.html',
})

export class EditGroupPage {
  account: Account =
  {
    uid: null,
    email: null,
    name: null,
    houseOwner: false,
    address: null,
    groups: []
  };
  groups: Group[]; 

  public userList: any[];
  public loadedUserList: any[] = [];
  public emails: any[] = [];
  public uEmails: any[] = [];
  public addedEmails: any[] = [];

  // tslint:disable-next-line: max-line-length
  constructor(public navCtrl: NgxNavigationWithDataComponent, public router: Router,public toastController: ToastController, private firestore: AngularFirestore, public afAuth: AngularFireAuth, public helper: HelperService, private crudService: CrudService, private dataService: DataService) {
    afAuth.authState.subscribe(user => {
      if (user) {
        this.account = helper.getAccount(afAuth, dataService, crudService);
      }
      
    });
    console.log(this.account.uid);
    this.groups = crudService.getCreatedGroups(this.account.uid);
    
  }
}
