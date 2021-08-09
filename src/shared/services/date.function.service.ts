import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DateFunctionService {

  constructor() { }

  getYYYYMMDDFromDate(date: Date) {
    const YYYY = date.getFullYear() + '';
    const MM = this.padLeft(date.getMonth(), 2, '0');
    const DD = this.padLeft(date.getDay(), 2, '0');
    console.log('date ' + YYYY + MM + DD);
    return '' + YYYY + MM + DD;
  }

  getDateFromYYYYMMDD(dateString: String) {
    const year  = +dateString.substring(0, 4);
    const month = +dateString.substring(4, 6);
    const day   = +dateString.substring(6, 8);

    const date  = new Date(year, month - 1, day);

    return date;
  }

  padLeft(num: number, size: number, padString: string): string {
    let s = num + '';
    while (s.length < size) {
      s = padString + s;
    }
    return s;
  }
}
