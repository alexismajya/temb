import { Injectable } from '@angular/core';
import { AlertService } from './alert.service';
import { AppEventService } from './app-events.service';

@Injectable({ providedIn: 'root' })
export class UpdatePageContentService {
  constructor(
    private appEventService: AppEventService,
    private alert: AlertService
  ) {}

  triggerSuccessUpdateActions(name: string, message: string) {
    this.alert.success(message);
    this.appEventService.broadcast({ name });
  }
}
