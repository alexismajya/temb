import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket: any;
  constructor() {}

  setupSocketConnection() {
    this.socket = io(environment.tembeaBackEndUrl);
  }

  listen = (eventName: any) => {
    return Observable.create((observer: any) => {
      this.socket.on(eventName, (message: any) => {
        observer.next(message);
      });
    });
  }

  broadcast = (event: any, message: any) => {
    this.socket.emit(event, message);
  }
}
