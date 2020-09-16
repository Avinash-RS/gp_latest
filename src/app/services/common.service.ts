import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public IsWait = false;

  constructor(private snackBar: MatSnackBar) { }

  success(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1500,
      verticalPosition: 'top',
      panelClass: ['success-bg-color']
    });
  }

  error(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['warn-bg-color']
    });
  }

  showLoader() {
    this.IsWait = true;
  }

  hideLoader() {
    this.IsWait = false;
  }


}
