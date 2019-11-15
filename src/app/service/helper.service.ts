import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { DataService } from './../service/data.service';
import { CrudService } from './crud.service';
import { Account } from '../account.model';
import { Party } from '../party.model';

@Injectable({
  providedIn: 'root'
})

export class HelperService {

  constructor() { }

  /**
   * Formats the date for party invites by converting Firebase timestamp to a readable string
   */
  getStringDate(date: Date): string {
    // tslint:disable-next-line: max-line-length
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let timeString: string;
    if (date.getHours() > 12) {
      timeString = (date.getHours() - 12) + ':' + this.pad(date.getMinutes()) + ' PM';
    } else {
      timeString = date.getHours() + ':' + this.pad(date.getMinutes()) + ' AM';
    }
    return monthNames[date.getMonth()] + ' ' + date.getDate() + ' ' + timeString;
  }

  /**
   * Used to add leading 0 to time if date.getMinutes() is less than 10
   */
  pad(n): string {
    return (n < 10) ? ('0' + n) : n;
  }

  /**
   * Helper method for getting account data
   */
  getAccount(afAuth: AngularFireAuth, dataService: DataService, crudService: CrudService): Account {
    // Get user account info from singleton value if possible. Otherwise retrieve from database.
    if (!dataService.getAccountData()) {
      // Get account data from database for current user if it exists. If not create database document for the user
      // Set singleton account value so other pages can access account data
      dataService.setAccountData(crudService.getUserAccount(afAuth));
    }
    return dataService.getAccountData();
  }

  /**
   * Helper method for getting parties a user is invited to
   */
  getParties(afAuth: AngularFireAuth, dataService: DataService, crudService: CrudService): Party[] {
    // Get user account info from singleton value if possible. Otherwise retrieve from database.
    if (!dataService.getPartyData()) {
      // Get account data from database for current user if it exists. If not create database document for the user
      // Set singleton account value so other pages can access account data
      dataService.setPartyData(crudService.getPartyForUser(afAuth.auth.currentUser.email));
    }
    return dataService.getPartyData();
  }

  /**
   * Helper method for getting parties the user created
   */
  getCreatedParties(afAuth: AngularFireAuth, dataService: DataService, crudService: CrudService): Party[] {
    // Get user account info from singleton value if possible. Otherwise retrieve from database.
    if (!dataService.getCreatedPartyData()) {
      // Get account data from database for current user if it exists. If not create database document for the user
      // Set singleton account value so other pages can access account data
      dataService.setCreatedPartyData(crudService.getPartyCreatedByUser(afAuth.auth.currentUser.uid));
    }
    return dataService.getCreatedPartyData();
  }
}
