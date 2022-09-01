import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DateFunctionService {

  constructor() { }

  getYYYYMMDDFromDate(date: Date): string {
    const YYYY = date.getFullYear() + '';
    const MM = this.padLeft(date.getMonth() + 1, 2, '0'); // these functions are zero based (hence +1)
    const DD = this.padLeft(date.getDate(), 2, '0');
    return '' + YYYY + MM + DD;
  }

  getDateFromYYYYMMDD(dateString: string): Date {
    const year  = +dateString.substring(0, 4);
    const month = +dateString.substring(4, 6);
    const day   = +dateString.substring(6, 8);

    let date  = new Date(year, month - 1, day);
    if (dateString.length > 8) {
        const hours = +dateString.substring(8, 10);
        const minutes = +dateString.substring(10, 12);
        const seconds = +dateString.substring(12, 14);
        date = new Date(year, month - 1, day, hours, minutes, seconds);
    }

    return date;
  }

  padLeft(num: number, size: number, padString: string): string {
    let s = num + '';
    while (s.length < size) {
      s = padString + s;
    }
    return s;
  }

  dateWithoutTime(dateTime): Date {
    const date = new Date(dateTime. getTime());
    date. setHours(0, 0, 0, 0);
    return date;
    }
}
