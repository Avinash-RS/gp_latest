import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { IModalInfo } from '../../Interface/model';

@Component({
  selector: 'app-modal-info-withbutton',
  templateUrl: './modal-info-withbutton.component.html',
  styleUrls: ['./modal-info-withbutton.component.scss']
})
export class ModalInfoWithbuttonComponent implements OnInit {

  modalData: IModalInfo[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.modalData = [];
    this.modalData.push(this.data);

    if (this.modalData[0].iconName === 'success') {
      this.modalData[0].iconName = 'check_circle';
    } else {
      this.modalData[0].iconName = 'error';
    }


  }

}
