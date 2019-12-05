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

@Component({
    selector: 'app-group',
    templateUrl: 'group.page.html',
    styleUrls: ['group.page.scss'],
})

export class GroupPage {
  account: Account =
  {
    uid: null,
    email: null,
    name: null,
    houseOwner: false,
    address: null,
    groups: []
  };
  group: Group = 
  {
      creatorID: null,
      groupName: null,
      members: []
  }
  public userList: any[];
  public loadedUserList: any[] = [];
  public emails: any[] = [];
  public uEmails: any[] = [];
  public addedEmails: any[] = [];

  // tslint:disable-next-line: max-line-length
  constructor(public toastController: ToastController, private firestore: AngularFirestore, public afAuth: AngularFireAuth, public helper: HelperService, private crudService: CrudService, private dataService: DataService) {
    afAuth.authState.subscribe(user => {
      if (user) {
        this.account = helper.getAccount(afAuth, dataService, crudService);
        this.group.creatorID = this.account.uid;
        this.group.members.push(this.account.email);
      }
      
    });
  }

  ngOnInit(){
  this.firestore.collection('users').valueChanges()
  .subscribe(userList=> {
      this.userList = userList;
      console.log(userList.length);
      while(userList.length > 0)
      {
          let user: any = userList.pop();
          let account = user;      
          this.loadedUserList.push(account);
          if(account.email != this.account.email){
            this.emails.push(account.email);
          }
          
      }
      console.log(this.loadedUserList);
      console.log(this.emails);
        });
    } 

    initializeItems(): void {
        this.userList = this.loadedUserList;
      }
    
    filterList(evt: CustomEvent) {
        this.initializeItems();
      
        const search = evt.detail.value;
        console.log(search);
        console.log(this.emails);
       document.getElementById("results").style.display = "block";
        this.emails = this.emails.filter(email => {
          if (email && search) {
            if (email.toLowerCase().indexOf(search.toLowerCase()) > -1) {
              return true;
            }
            return false;
          }
        });
      }

      Add(email, idx){
          if(!this.group.members.includes(email)){
            this.group.members.push(email); 
            this.addedEmails.push(email);
            this.firestore.collection('users').valueChanges()
            .subscribe(userList=> {
                this.userList = userList;
                console.log(userList.length);
                while(userList.length > 0)
                {
                    let user: any = userList.pop();
                    let account = user;      
                    if(account.email != this.account.email){
                        if(!this.addedEmails.includes(account.email)){
                        this.uEmails.push(account.email);
                        }
                    }                    
                }
                this.emails = this.uEmails;
                this.uEmails = [];
                console.log(this.loadedUserList);
                console.log(this.emails);
                    });           
                }     
            }

      createGroup() {
           // tslint:disable-next-line: prefer-const
            let record = this.group;
            if (record.groupName == null) {
            this.presentToast(false);
            } else {
                let uRecord = this.account;
                uRecord.groups.push(this.group.groupName);
            this.crudService.createNewGroup(record, this.account.uid, uRecord).then(resp => {
                this.presentToast(true);
                console.log(resp);
            })
            .catch(error => {
                console.log(error);
            });
        }
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
            message: 'You successfully created a group!',
            duration: 2000
          });
          toast.present();
        }
      }
    }
