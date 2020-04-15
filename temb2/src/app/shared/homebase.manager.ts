import { Injectable } from '@angular/core';
import { HomeBaseService } from './homebase.service';
import { AppEventService } from './app-events.service';

@Injectable()
export class HomeBaseManager {
  store: Storage;

  constructor(private readonly homebaseService: HomeBaseService, public appEventService: AppEventService) {
    this.store = localStorage;
  }

  setHomebase(homebase) {
    this.homebaseService.getByName(homebase)
      .subscribe(h => {
        this.store.setItem('HOMEBASE_NAME', h.homebase[0].homebaseName);
        this.store.setItem('HOMEBASE_ID', h.homebase[0].id.toString());
        this.appEventService.broadcast({name: 'setHomebase'});
      });
  }

  storeHomebase(homebase) {
    this.store.setItem('HOMEBASE_NAME', homebase.name);
    this.store.setItem('HOMEBASE_ID', homebase.id.toString());
  }

  getHomebaseId() {
    const id = this.store.getItem('HOMEBASE_ID');
    if (!id) {
      throw new Error('User did not specify any homebase');
    }
    return id;
  }

  getHomeBase() {
    try {
      const homebaseName = this.store.getItem('HOMEBASE_NAME');
    const id = parseInt(this.store.getItem('HOMEBASE_ID'), 10);
    if (!id || !homebaseName) {
      throw new Error('User did not specify any homebase');
    }
    return ({ id, homebaseName });
    } catch (error) {
      throw new Error('User did not specify any homebase');
    }
  }
}
