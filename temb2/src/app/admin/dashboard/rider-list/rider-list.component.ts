import { Component, OnInit, Input } from '@angular/core';
import {IDeserializedRider} from '../../../shared/models/rider.model';

@Component({
  selector: 'app-rider-list',
  templateUrl: './rider-list.component.html',
  styleUrls: ['./rider-list.component.scss']
})
export class RiderListComponent implements OnInit {
  @Input() title: string;
  @Input() riders$: IDeserializedRider[];
  constructor() { }

  ngOnInit() { }
}
