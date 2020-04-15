import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DisplayTripModalComponent } from '../trips/display-trip-modal/display-trip-modal.component';


@Component({
  selector: 'app-table-component',
  templateUrl: './base-table.component.html',
  styleUrls: ['./base-table.component.scss']
})
export class BaseTableComponent {

  @Input() rowType: string;
  constructor(
    public dialog: MatDialog,
  ) { }

  viewRowDescription(rowInfo) {
    this.dialog.open(DisplayTripModalComponent, {
      height: '660px',
      width: '592px',
      data: {
        rowInfo,
        rowType: this.rowType,
        closeText: 'Close'
      }
    });
  }
}
