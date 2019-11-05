import { Component } from '@angular/core';
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
export class CalendarPage{
  eventSource = [];
  parties: Party[];
  account: Account;
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };
  selectedDate = new Date();
  viewTitle;

  // tslint:disable-next-line: max-line-length
  constructor(private dataService: DataService, public helper: HelperService, public afAuth: AngularFireAuth, private crudService: CrudService) {
    afAuth.authState.subscribe(async user => {
      if (user) {
        this.account = helper.getAccount(afAuth, dataService, crudService);
        this.parties = await this.helper.getParties(afAuth, dataService, crudService);
        this.parties.forEach(party => {
          let event = {
            startTime: new Date(party.startTime.toISOString()),
            endTime: new Date(party.endTime.toISOString()),
            allDay: false,
            title: party.description
          };
          this.eventSource.push(event);
        });
      }
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
