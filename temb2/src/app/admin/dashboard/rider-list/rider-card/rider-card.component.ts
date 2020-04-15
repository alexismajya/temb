import { Component, OnInit, Input } from '@angular/core';
import {IDeserializedRider} from '../../../../shared/models/rider.model';

@Component({
  selector: 'app-rider-card',
  templateUrl: './rider-card.component.html',
  styleUrls: ['./rider-card.component.scss']
})
export class RiderCardComponent {
  @Input() rider: IDeserializedRider;
  constructor() { }
}
