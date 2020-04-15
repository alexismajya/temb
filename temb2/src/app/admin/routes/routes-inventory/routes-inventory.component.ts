import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RoutesInventoryService } from '../../__services__/routes-inventory.service';
import { IDeleteRouteResponse } from 'src/app/shared/models/route-inventory.model';
import { IRouteBatch, IEditRouteBatch } from '../../../shared/models/route-inventory.model';
import { BaseTableComponent } from '../../base-table/base-table.component';
import { AlertService } from '../../../shared/alert.service';
import { ITEMS_PER_PAGE } from '../../../app.constants';
import { MatDialog } from '@angular/material';
import { ConfirmModalComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import RenameRouteBatch from './routes-inventory.helper';
import { RoutesInventoryEditModalComponent } from './routes-inventory-edit-modal/routes-inventory-edit-modal.component';
import { AppEventService } from 'src/app/shared/app-events.service';
import { CreateRouteHelper } from '../create-route/create-route.helper';
import { Subject, Subscription } from 'rxjs';
import { SearchService } from '../../__services__/search.service';
import { getDialogProps } from 'src/app/utils/generic-helpers';
import { GoogleAnalyticsService } from '../../__services__/google-analytics.service';
import { eventsModel, modelActions } from '../../../utils/analytics-helper';

@Component({
  selector: 'app-inventory',
  templateUrl: './routes-inventory.component.html',
  styleUrls: [
    './routes-inventory.component.scss',
    '../../../auth/login-redirect/login-redirect.component.scss'
  ],
  providers: [SearchService]
})
export class RoutesInventoryComponent extends BaseTableComponent implements OnInit, OnDestroy {
  routes: IRouteBatch[] = [];
  pageNo: number;
  pageSize: number;
  sort: string;
  totalItems: number;
  lastRoute;
  duplicate = true;
  isLoading: boolean;
  displayText = 'No Routes Found.';
  searchTerm$ = new Subject<string>();
  subscriptions = new Array<Subscription>();

  constructor(
    private searchService: SearchService,
    private analytics: GoogleAnalyticsService,
    private alert: AlertService,
    private appEventsService: AppEventService,
    public dialog: MatDialog,
    public createRouteHelper: CreateRouteHelper,
    public router: Router,
    public routeService: RoutesInventoryService,
  ) {
    super(dialog);
    this.pageNo = 1;
    this.sort = 'name,asc,batch,asc';
    this.rowType = 'routeBatch';
    this.pageSize = ITEMS_PER_PAGE;
    this.getSearchResults();
  }

  ngOnInit() {
    this.getRoutesInventory();
    const updateSubscription = this.appEventsService.subscribe('updateRouteInventory', () => {
      this.getRoutesInventory();
    });
    this.subscriptions.push(updateSubscription);
  }

  getRoutesInventory = () => {
    this.isLoading = true;
    this.routeService.getRoutes(this.pageSize, this.pageNo, this.sort).subscribe(routesData => {
        const { data: { routes, pageMeta } } = routesData;
        this.routes = this.renameRouteBatches(routes);
        this.totalItems = pageMeta.totalResults;
        this.appEventsService.broadcast({ name: 'updateHeaderTitle', content: { badgeSize: pageMeta.totalResults } });
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
        this.displayText = `Oops! We're having connection problems.`;
      });
  }

  getSearchResults = () => {
    this.isLoading = true;
    const {sort, pageSize, pageNo} = this;
    const defaultTerm = `sort=${sort}&size=${pageSize}&page=${pageNo}`;
    this.searchService.searchData(this.searchTerm$, 'routes', defaultTerm).subscribe(routesData => {
        const { routes, pageMeta } = routesData;
        this.routes = routes;
        this.totalItems = pageMeta.totalResults;
        this.appEventsService.broadcast({ name: 'updateHeaderTitle', content: { badgeSize: pageMeta.totalResults } });
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
        this.displayText = `Oops! We're having connection problems.`;
      });
  }

  renameRouteBatches(routes: IRouteBatch[]) {
    let renamedBatches = routes;
    if (routes.length > 0) {
      const renameBatchesObject = new RenameRouteBatch(routes, this.lastRoute);
      renamedBatches = renameBatchesObject.renameRouteBatches();
      this.lastRoute = renamedBatches[renamedBatches.length - 1];
    }
    return renamedBatches;
  }

  copyRouteBatch(routeId: number) {
    return this.sendRequestToServer(routeId);
  }

  showDialog(displayText: string, func: Function, value: any) {
    const dialogRef = this.dialog.open(ConfirmModalComponent, getDialogProps(displayText));
    const sub = dialogRef.componentInstance.executeFunction.subscribe(() => func.call(this, value));
    this.subscriptions.push(sub);
  }

  showCopyConfirmModal(routeBatch: IRouteBatch) {
    this.showDialog('copy this route', this.copyRouteBatch, routeBatch.id);
  }

  async sendRequestToServer(routeBatchId: number) {
    try {
      const response = await this.routeService.createRoute(routeBatchId, this.duplicate);
      this.createRouteHelper.notifyUser([response.message], 'success');
      this.analytics.sendEvent(eventsModel.Routes, modelActions.CREATE);
      this.router.navigate(['/admin/routes/inventory']);
      this.getRoutesInventory();
    } catch (error) {
      this.createRouteHelper.notifyUser([error.error.message || 'An error occurred.']);
    }
  }

  setPage(page: number): void {
    this.pageNo = page;
    this.getRoutesInventory();
  }

  changeRouteStatus(id: number, status: string) {
    this.routeService.changeRouteStatus(id, { status })
      .subscribe((response) => {
        if (response.success) {
          this.updateRoutesData(id, status);
          this.analytics.sendEvent(eventsModel.Routes, modelActions.UPDATE);
        }
      }, () => this.alert.error('Something went wrong! try again'));
  }

  updateRoutesData(id: number, status: string): void {
    this.routes = this.routes.map((route) => {
      if (route.id === id) {
        route = { ...route, status };
      }
      return route;
    });
  }

  async deleteRoute(routeBatchId: number) {
    this.routeService.deleteRouteBatch(routeBatchId)
      .subscribe((response: IDeleteRouteResponse) => {
        const { success, message } = response;
        if (success) {
          this.alert.success(message);
          this.analytics.sendEvent(eventsModel.Routes, modelActions.DELETE);
          this.getRoutesInventory();
        } else { this.alert.error(message); }
      });
  }

  showDeleteModal(routeBatchId: number): void {
    this.showDialog('delete this batch', this.deleteRoute, routeBatchId);
  }

  editRoute(routeBatch: IRouteBatch): void {
    const { id, status, takeOff, capacity, batch, inUse, route: { name} } = routeBatch;
    this.dialog.open(RoutesInventoryEditModalComponent, {
      data: <IEditRouteBatch> {
        id, status, takeOff, capacity, batch, inUse, name
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
