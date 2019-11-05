import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MonthViewComponent } from 'ionic2-calendar/monthview';
import { AngularFireAuth } from '@angular/fire/auth';
import { Account } from '../account.model';
import { Party } from '../party.model';
import { CrudService } from '../service/crud.service';
import { HelperService } from '../service/helper.service';
import { DataService } from '../service/data.service';

@Component({
  templateUrl: 'calendar.page.html',
  styleUrls: ['calendar.page.scss'],
})
export class CalendarPage {

  eventSource = [];
  parties: Party[];
  account: Account =
  {
    uid: '',
    email: '',
    name: '',
    houseOwner: false,
    address: ''
  };
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };
  selectedDate = new Date();
  viewTitle;

  // tslint:disable-next-line: max-line-length
  constructor(private db: AngularFirestore, public dataService: DataService, private helperService: HelperService, private afAuth: AngularFireAuth, private crudService: CrudService) {
    this.account = helperService.getAccount(afAuth, dataService, crudService);
    this.parties = crudService.getPartyForUser(this.account.email);
    this.db.collection(`events`).snapshotChanges().subscribe(colSnap => {
      this.eventSource = [];
      colSnap.forEach(snap => {
        const event: any = snap.payload.doc.data();
        event.id = snap.payload.doc.id;
        event.startTime = new Date(new Date(event.startTime.toDate()).toISOString());
        event.endTime = new Date(new Date(event.endTime.toDate()).toISOString());
        event.allDay = false;
        event.title = event.description;
        console.log(event);
        console.log(this.parties);
        for (const parties of this.parties) {
          if (event.description === parties.description) {
            this.eventSource.push(event);
          }
        }
      });
      console.log(this.eventSource);
    });
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
