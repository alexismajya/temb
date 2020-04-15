import { MatDialog } from '@angular/material';
import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AppEventService } from 'src/app/shared/app-events.service';
import SubscriptionHelper from 'src/app/utils/unsubscriptionHelper';
import { ConfirmModalComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { HomebaseModalComponent } from '../homebase-modal/homebase-modal.component';

@Component({
  selector: 'app-homebase-card',
  templateUrl: './homebase-card.component.html',
  styleUrls: ['../../cabs/cab-inventory/cab-card/cab-card.component.scss']
})
export class HomebaseCardComponent implements OnInit, OnDestroy {
  @Output() showOptions: EventEmitter<any> = new EventEmitter();
  @Input() homebaseName: any;
  @Input() country: string;
  @Input() currency: string;
  @Input() showMoreIcon: boolean;
  @Input() hidden: boolean;
  @Input() homebaseId: number;
  @Input() addressId: number;
  @Input() channel: string;
  @Input() opsEmail: string;
  @Input() travelEmail: string;
  confirmDeleteSubscription: any;
  closeDialogSubscription: any;

  constructor(
    public appEventService: AppEventService,
    public matDialog: MatDialog
  ) {}

  ngOnInit() {}

  openEditModal() {
    const dialogRef = this.matDialog.open(HomebaseModalComponent, {
      maxHeight: '568px', width: '620px', panelClass: 'add-cab-modal-panel-class',
      data: {
        homebaseName: this.homebaseName,
        country: this.country,
        id: this.homebaseId,
        currency: this.currency,
        addressId: this.addressId,
        channel: this.channel,
        opsEmail: this.opsEmail,
        travelEmail: this.travelEmail
      }
    });
      dialogRef.afterClosed().subscribe(() => {
      this.hidden = !this.hidden;
    }); }

    showDeleteModal() {
      this.matDialog.open(ConfirmModalComponent, {
        data: { displayText: `delete ${this.homebaseName} homebase`, confirmText: 'Yes'}
      });
      this.closeDialogSubscription = this.appEventService.subscribe('closeConfirmationDialog', () => {
        return this.hidden = !this.hidden;
      });
    }

  showMoreOptions() {
    this.hidden = !this.hidden;
    this.showOptions.emit();
  }

  ngOnDestroy(): void {
    SubscriptionHelper.unsubscribeHelper([this.closeDialogSubscription, this.confirmDeleteSubscription]);
  }
}
