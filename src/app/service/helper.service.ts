import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class HelperService {

  constructor() { }

  // Formats the Date for invites
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

  // Used to add leading 0 to time if date.getMinutes() is less than 10
  pad(n): string {
    return (n < 10) ? ('0' + n) : n;
  }
}
