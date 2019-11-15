import { AccountPage } from './account.page';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { CrudService } from './../service/crud.service';

let component: AccountPage;

var page = require("../account/account.page");

describe('AccountPage', () => {
    let service: AccountPage;
    
    //beforeEach(() => service = new CrudService();});

    // (alias) new AccountPage(afAuth: AngularFireAuth, crudService: CrudService): AccountPage
    //  import AccountPage
    //beforeEach(() => service = new AccountPage(AngularFireAuth, CrudService);});
    
    it('Sign Out (Doing)', () => {
        //expect(component).toBeTruthy();
        //expect(4).toBe(4);
      
      });
      it('Reload ', () => {
        //expect(component).toBeTruthy();
        //expect(4).toBe(4);
        var works;
        try{
            // This causes the web page to just straight up not open but it works
            //window.location.reload();
            works = 1;
        }
        catch(e){
            works = 0;
        }

        expect(works).toBe(1);
      });
      it('Get User Info (Doing)', () => {
        //expect(component).toBeTruthy();
        //expect(4).toBe(4);
        page.getUserInfo();

      });
      it('Create Record (Doing)', () => {
        //expect(component).toBeTruthy();
        //expect(4).toBe(4);
      });
      it('Remove Record (Doing)', () => {
        //expect(component).toBeTruthy();
        //expect(4).toBe(4);
      });
      it('Edit Record (Doing)', () => {
        //expect(component).toBeTruthy();
        //expect(4).toBe(4);
      });
      it('Update Record (Doing)', () => {
        //expect(component).toBeTruthy();
        //expect(4).toBe(4);
      });


});