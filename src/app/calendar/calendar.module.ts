import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgCalendarModule } from 'ionic2-calendar';

import { CalendarPage } from './calendar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: CalendarPage
      }
    ]),
    NgCalendarModule,
  ],
  declarations: [CalendarPage]
})

export class CalendarPageModule{}