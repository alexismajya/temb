var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DepartmentsComponent } from './settings/departments/departments.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateRouteComponent } from './routes/create-route/create-route.component';
import { RoutesInventoryComponent } from './routes/routes-inventory/routes-inventory.component';
import { AdminComponent } from './admin/admin.component';
import { RouteRequestsComponent } from './routes/route-requests/route-requests.component';
import { PagingParamsResolver } from '../shared/paging-params.resolver';
import { PendingRequestComponent } from './trips/pending-request/pending-request.component';
import { TripNavComponent } from './trips/trip-nav/trip-nav.component';
import { AirportTransfersComponent } from './travel/airport-transfers/airport-transfers.component';
import { EmbassyVisitsComponent } from './travel/embassy-visits/embassy-visits.component';
import { FellowComponent } from './settings/fellows/fellow/fellow.component';
import { FellowNavComponent } from './settings/fellows/fellow-nav/fellow-nav.component';
import { ProviderInventoryComponent } from './providers/provider-inventory/provider-inventory.component';
import { ProviderNavComponent } from './providers/provider-nav/provider-nav.component';
import { RouteTripsComponent } from './routes/route-trips/route-trips.component';
import { LocationService } from '../shared/locations.service';
import { RoleManagementComponent } from './users/role-management/role-management.component';
import { AuthGuard } from '../auth/auth.guard';
import { UserInventoryComponent } from './users/user-inventory/user-inventory.component';
import { HomebaseListComponent } from './homebase/homebase-list/homebase-list.component';
var routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [],
                data: { title: 'Welcome' }
            },
            {
                path: 'routes/create',
                component: CreateRouteComponent,
                canActivate: [],
                data: { title: 'Create Route' }
            },
            {
                path: 'routes/requests',
                component: RouteRequestsComponent,
                canActivate: [],
                data: { title: 'Routes Requests' }
            },
            {
                path: 'routes/inventory',
                component: RoutesInventoryComponent,
                canActivate: [],
                data: { title: 'Routes Inventory' }
            },
            {
                path: 'routes/route-trips',
                component: RouteTripsComponent,
                canActivate: [],
                data: { title: 'Routes Analysis' }
            },
            {
                path: 'trips/pending',
                component: PendingRequestComponent,
                resolve: {
                    pagingParams: PagingParamsResolver
                },
                canActivate: [],
                data: { title: 'Pending Trips' }
            },
            {
                path: 'trips/itinerary',
                component: TripNavComponent,
                canActivate: [],
                data: { title: 'All Trips' }
            },
            {
                path: 'travel/embassy-visits',
                component: EmbassyVisitsComponent,
                canActivate: [],
                data: { title: 'Embassy Visits' }
            },
            {
                path: 'travel/airport-transfers',
                component: AirportTransfersComponent,
                canActivate: [],
                data: { title: 'Airport Transfers' }
            },
            {
                path: 'providers',
                component: ProviderInventoryComponent,
                canActivate: [],
                data: { title: 'Providers' }
            },
            {
                path: 'providers/:providerName/:providerId',
                component: ProviderNavComponent,
                canActivate: [],
                data: { title: 'Vehicles' }
            },
            {
                path: 'settings/fellows',
                component: FellowNavComponent,
                canActivate: [],
                data: { title: 'Engineers' }
            },
            {
                path: 'settings/fellows/fellow/:id',
                component: FellowComponent,
                canActivate: [],
                data: { title: 'Engineer Trips' }
            },
            {
                path: 'settings/departments',
                component: DepartmentsComponent,
                canActivate: [],
                data: { title: 'Departments' }
            },
            {
                path: 'users/roles',
                component: RoleManagementComponent,
                canActivate: [AuthGuard],
                data: { title: 'Role Management', roles: ['Super Admin'] }
            },
            {
                path: 'users/new-user',
                component: UserInventoryComponent,
                canActivate: [],
                data: { title: 'Users' }
            },
            {
                path: 'homebases',
                component: HomebaseListComponent,
                canActivate: [],
                data: { title: 'Homebases' }
            }
        ]
    }
];
var AdminRoutingModule = /** @class */ (function () {
    function AdminRoutingModule() {
    }
    AdminRoutingModule = __decorate([
        NgModule({
            imports: [RouterModule.forChild(routes)],
            exports: [RouterModule],
            providers: [LocationService]
        })
    ], AdminRoutingModule);
    return AdminRoutingModule;
}());
export { AdminRoutingModule };
//# sourceMappingURL=admin-routing.module.js.map