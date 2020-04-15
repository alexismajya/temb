import { Component, Output, EventEmitter, OnInit, } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { IProviderModel, ProviderNotificationChannels, ProviderModel } from '../../../shared/models/provider.model';
import { ProviderService } from '../../__services__/providers.service';
import { AlertService } from '../../../shared/alert.service';
import { AppEventService } from '../../../shared/app-events.service';
import { SlackService } from '../../__services__/slack.service';
import { IChannel } from '../../../shared/models/channel.model';
import { GoogleAnalyticsService } from '../../__services__/google-analytics.service';
import { eventsModel, modelActions } from '../../../utils/analytics-helper';

@Component({
  templateUrl: './add-provider-modal.component.html',
  styleUrls: [
    './../../../admin/cabs/add-cab-modal/add-cab-modal.component.scss',
    './add-provider-modal.component.scss',
  ]
})

export class AddProviderModalComponent implements OnInit {
  provider: ProviderModel;
  loading: boolean;
  slackChannels: IChannel[] = [];
  notificationChannels: { key: string; value: string; }[];
  @Output() executeFunction = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<AddProviderModalComponent>,
    public providerService: ProviderService,
    public alert: AlertService,
    private appEventService: AppEventService,
    public slackService: SlackService,
    private analytics: GoogleAnalyticsService
  ) {
    this.provider = new ProviderModel();
    this.notificationChannels = Object.entries(ProviderNotificationChannels)
      .map(([key, value]) => ({ key, value }));
  }

  ngOnInit() {
    this.loadChannels();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  logError(error) {
    if (error && error.status === 404) {
      this.alert.error('Provider user email entered does not exist');
    } else if (error && error.status === 409) {
      const { error: { message } } = error;
      this.alert.error(message);
    } else {
      this.alert.error('Something went wrong, please try again');
    }
  }

  addProvider(data: IProviderModel) {
    this.loading = true;
    this.providerService.add(data).subscribe(
      (response) => {
        if (response.success) {
          this.alert.success(response.message);
          this.appEventService.broadcast({ name: 'newProvider' });
          this.analytics.sendEvent(eventsModel.Providers, modelActions.CREATE);
          this.dialogRef.close();
          this.loading = false;
        }
      },
      (error) => {
        this.logError(error);
        this.loading = false;
      }
    );
  }

  loadChannels() {
    this.slackService.getChannels().subscribe((response) => {
      if (response.success) {
        this.slackChannels = response.data;
      }
    });
  }

  toggleNotificationChannel(value: ProviderNotificationChannels) {
    this.provider.notificationChannel = value;
    switch (value) {
      case ProviderNotificationChannels['Slack Channel']:
        break;
      default:
        this.provider.channelId = undefined;
    }
  }

  toggleSlackChannelId(value: string) {
    this.provider.channelId = value;
  }

  get showSlackChannels() {
    return this.provider.notificationChannel === ProviderNotificationChannels['Slack Channel'];
  }
}
