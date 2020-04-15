import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SlackService {
  channelsUrl = `${environment.tembeaBackEndUrl}/api/v1/slack/channels`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      teamUrl: environment.teamUrl
    }),
  };

  constructor(private http: HttpClient) { }

  getChannels(): Observable<any> {
    return this.http.get<any>(this.channelsUrl, this.httpOptions);
  }
}
