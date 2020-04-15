import { HomeBaseService } from './../../../shared/homebase.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ITEMS_PER_PAGE } from 'src/app/app.constants';
import { AppEventService } from 'src/app/shared/app-events.service';
import SubscriptionHelper from 'src/app/utils/unsubscriptionHelper';

@Component({
  selector: 'app-homebase-list',
  templateUrl: './homebase-list.component.html',
  styleUrls: ['./homebase-list.component.scss']
})
export class HomebaseListComponent implements OnInit, OnDestroy {
  listOfHomebases: Array<any>;
  isLoading: boolean;
  pageNo: number;
  pageSize: number;
  totalItems: number;
  displayText: string;
  searchTerm$: string;
  updateSubscription: any;
  deleteSubscription: any;
  updateListSubscription: { unsubscribe: any };
  currentOptions = -1;

  constructor(
    private homebaseService: HomeBaseService,
    public appEventsService: AppEventService
  ) {
    this.isLoading = true;
    this.pageNo = 1;
    this.pageSize = ITEMS_PER_PAGE;
    this.isLoading = true;
    this.displayText = 'No Homebase yet';
    this.getSearchResults(this.searchTerm$);
  }

  ngOnInit() {
    this.getListOfHomebases();
    this.updateSubscription = this.appEventsService.subscribe(
      'updateHomebaseEvent',
      () => this.getListOfHomebases()
    );
    this.deleteSubscription = this.appEventsService.subscribe(
      'providerDeletedEvent',
      () => this.getListOfHomebases()
    );
    this.updateListSubscription = this.appEventsService.subscribe(
      'newHomebase',
      () => this.getListOfHomebases()
    );
  }

  getSearchResults = async searchItem => {
    if (searchItem) {
      this.isLoading = true;
      this.listOfHomebases = this.listOfHomebases.filter(homebase =>
        homebase.homebaseName.toLowerCase().includes(searchItem.toLowerCase())
      );
      this.isLoading = false;
    } else {
      this.getListOfHomebases();
    }
  }

  getListOfHomebases = () => {
    this.isLoading = true;
    this.homebaseService.getAllHomebases().subscribe(
      (data: any) => {
        const {
          homebases,
          pageMeta: { totalResults }
        } = data;
        this.totalItems = totalResults;
        this.appEventsService.broadcast({
          name: 'updateHeaderTitle',
          content: { badgeSize: this.totalItems, actionButton: 'Add Homebase' }
        });
        this.listOfHomebases = homebases;
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
        this.displayText = `Oops! We're having connection problems.`;
      }
    );
    this.currentOptions = -1;
  }

  setPage(page: number): void {
    this.pageNo = page;
    this.getListOfHomebases();
  }

  showOptions(providerId) {
    this.currentOptions = this.currentOptions === providerId ? -1 : providerId;
  }

  ngOnDestroy(): void {
    SubscriptionHelper.unsubscribeHelper([
      this.updateSubscription,
      this.deleteSubscription,
      this.updateListSubscription
    ]);
  }
}
