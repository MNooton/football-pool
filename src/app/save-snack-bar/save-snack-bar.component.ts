import { Component, Inject, OnInit } from '@angular/core';
import {
  MatSnackBar as MatSnackBar,
  MAT_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA,
  MatSnackBarRef as MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
    selector: 'app-save-snack-bar',
    templateUrl: './save-snack-bar.component.html',
    styleUrls: ['./save-snack-bar.component.css'],
    standalone: false
})
export class SaveSnackBarComponent {
  message: string;
  actionName: string;
  actionFunction = () => {};

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data) {
    this.actionName = data.actionName;
    this.message = data.message;
    this.actionFunction = data.action;
  }

  dismiss(): void {
    this.data.preClose();
  }
  action(): void {
    this.actionFunction();
  }
  hasAction(): boolean {
    return this.actionFunction !== null;
  }

}
