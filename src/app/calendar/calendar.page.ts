import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MonthViewComponent } from 'ionic2-calendar/monthview';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  templateUrl: 'calendar.page.html',
  styleUrls: ['calendar.page.scss'],
})
export class CalendarPage {

  eventSource = [];

  calendar = {
    mode: 'month',
    currentDate: new Date(),
};
  
  selectedDate = new Date();
  viewTitle;
  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) {
    this.db.collection(`events`).snapshotChanges().subscribe(colSnap => {
      this.eventSource = [];
      colSnap.forEach(snap => {
        let event:any = snap.payload.doc.data();
        event.id = snap.payload.doc.id;
        event.startTime = event.startTime.toDate();
        event.endTime = event.endTime.toDate();
        event.allDay = false;
        event.title = event.title;
        console.log(event);
        this.eventSource.push(event);
      });
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