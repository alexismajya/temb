import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TripRequestService } from '../../app/admin/__services__/trip-request.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../shared/alert.service';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss']
})
export class ProviderComponent implements OnInit {
  teamId: any;
  tripId: number;
  providerId: number;
  succeeded: boolean = null;
  get driverName() {
    return this.tripConfirmationForm.get('driverName');
  }
  get driverPhoneNo() {
    return this.tripConfirmationForm.get('driverPhoneNo');
  }
  get vehicleModel() {
    return this.tripConfirmationForm.get('vehicleModel');
  }
  get vehicleRegNo() {
    return this.tripConfirmationForm.get('vehicleRegNo');
  }
  get vehicleColor() {
    return this.tripConfirmationForm.get('vehicleColor');
  }

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private jwtHelperService: JwtHelperService,
    public tripRequestService: TripRequestService,
    public alert: AlertService
  ) { }

  tripConfirmationForm = this.fb.group({
    driverName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
    driverPhoneNo: ['', [Validators.required, Validators.pattern(/^\+[1-9]\d{6,14}$/)]],
    vehicleModel: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    vehicleRegNo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    vehicleColor: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
  });

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(params => {
      if (params.has('token')) {
        const tokenParam = params.get('token');
        const decodedToken = this.jwtHelperService.decodeToken(tokenParam);
        this.teamId = decodedToken.teamId;
        this.tripId = decodedToken.tripId;
        this.providerId = decodedToken.providerId;
      }
    });
  }

  onSubmit() {
    if (this.providerId && this.tripId  &&  this.teamId) {
      this.tripConfirmationForm.value.teamId = this.teamId;
      this.tripConfirmationForm.value.tripId = this.tripId;
      this.tripConfirmationForm.value.providerId = this.providerId;
      this.tripRequestService.providerConfirm(this.tripConfirmationForm.value)
      .subscribe(
        (response) => {
          this.alert.success(response.message.message);
          this.succeeded = true;
        },
        (error) => {
          const errorMessage = error.error.error;
          errorMessage
          ? Object.keys(errorMessage).forEach(id => { this.alert.error(errorMessage[id]); })
          : this.alert.error(error.error.message.error);
          this.succeeded = false;
        }
      );
    } else {
      this.alert.error('Invalid token');
      this.succeeded = false;
    }
  }
}
