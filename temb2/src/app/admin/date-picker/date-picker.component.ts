import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatePickerComponent implements OnInit {
  @Input()
  dateFormat = 'YYYY-MM-DD';
  @Input()
  placeholder = 'Select Date';
  @Output()
  selectedDateChange: EventEmitter<string> = new EventEmitter();
  model = { selectedDate: null };
  @Input() maxDate;
  @Input() minDate;
  @Input() previous: boolean;
  @Input() type: string;

  @Input() initialDate: string;
  constructor() {}

  ngOnInit() {
    this.model.selectedDate = this.initialDate || new Date(Date.now()).toISOString();
    this.selectedDateChange.emit(moment(this.model.selectedDate).format('YYYY-MM-DD'));
  }

  update(event: MatDatepickerInputEvent<Date>) {
    const date = moment(event.value.toISOString());
    this.model.selectedDate = date.format('YYYY-MM-DD');
    this.selectedDateChange.emit(date.format(this.dateFormat));
  }
}
