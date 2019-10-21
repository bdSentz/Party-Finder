import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MonthViewComponent } from 'ionic2-calendar/monthview';
import { AngularFireAuth } from '@angular/fire/auth';
import { CrudService } from '../service/crud.service';
import { DataService } from '../service/data.service';
import { Account } from '../account.model';
import { Party } from '../party.model';


@Component({
  templateUrl: 'calendar.page.html',
  styleUrls: ['calendar.page.scss'],
})
export class CalendarPage {

  eventSource = [];
  accEmail = '';
  account: Account = 
  {
    uid: '',
    email: '',
    name: '',
    houseOwner: false,
    address: ''
  }
  party: Party = 
  {
    address: '',
    invitees: [],
    description: '',
    startTime: new Date,
    endTime: new Date,
  }
  calendar = {
    mode: 'month',
    currentDate: new Date(),
};

  selectedDate = new Date();
  viewTitle;
  constructor(private cS: CrudService, public afAuth: AngularFireAuth, private dataservice: DataService) {
    this.accEmail = this.afAuth.auth.currentUser.email;
    this.account = dataservice.getAccountData();
    this.eventSource = this.cS.getPartyForUser(this.account.email);
    
  }

  onViewTitleChanged(title) {
    console.log(title);
    this.viewTitle = title;
  }

  onEventSelected(event) {
    console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
  }

  onTimeSelected(ev) {
    console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
      (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
    this.selectedDate = ev.selectedTime;
  }

  onCurrentDateChanged(event: Date) {
    console.log('current date change: ' + event);
  }

  onRangeChanged(ev) {
    console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
  }
}
