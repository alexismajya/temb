import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AddressService {
  baseUrl: string;

  constructor(private readonly http: HttpClient) {
    this.baseUrl = `${environment.tembeaBackEndUrl}/api/v1/addresses`;
  }

  getAddressById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
}
