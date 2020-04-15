import { Injectable } from '@angular/core';
import { Location } from '../../../shared/location.model';

@Injectable({ providedIn: 'root' })
export class HomebaseHelper {

  formatNewhomebaseObject(formValues: any, coordinates: Location) {
    const requestObject = { ...formValues };
    const { lat: latitude, lng: longitude } = coordinates;
    requestObject.address = {
      address: requestObject.address,
      location: { latitude, longitude }
    };
    return requestObject;
  }

  loadDefaultProps(method: any, result: string): any {
    return new Promise((resolve, reject) => {
      method.subscribe((response) => {
        if (response.success) {
          resolve(response[`${result}`]);
        } else {
          reject('No data found');
        }
      });
    });
  }
}
