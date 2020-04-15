import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { TripAwaitingProviderComponent } from '../trip-awaiting-provider/trip-awaiting-provider.component';
import { ExportComponent } from '../../export-component/export.component';
import { AppTestModule } from 'src/app/__tests__/testing.module';
import { AngularMaterialModule } from '../../../angular-material.module';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { AppPaginationComponent } from '../../layouts/app-pagination/app-pagination.component';
import { ShortenNamePipe } from '../../__pipes__/shorten-name.pipe';
import { ShortenTextPipe } from '../../__pipes__/shorten-text.pipe';
import { ProviderService } from '../../__services__/providers.service';
import { UpdateTripProviderModalComponent } from '../update-trip-provider-modal/update-trip-provider-modal.component';
import { tripRequestMock } from 'src/app/shared/__mocks__/trip-request.mock';
import { providerServiceMock } from 'src/app/admin/__services__/__mocks__/providers.mock';
import { providersMock } from 'src/app/__mocks__/trips-providers.mock';
import { TripItineraryComponent } from '../trip-itinerary/trip-itinerary.component';


describe('TripAwaitingProviderComponent Unit test', () => {
  let component: TripAwaitingProviderComponent;
  let fixture: ComponentFixture<TripAwaitingProviderComponent>;
  let mockElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        TripAwaitingProviderComponent,
        ExportComponent,
        EmptyPageComponent,
        AppPaginationComponent,
        ShortenNamePipe,
        ShortenTextPipe,
        UpdateTripProviderModalComponent
      ],
      imports: [
        BrowserAnimationsModule,
        AppTestModule,
        AngularMaterialModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule
      ],
      schemas: [],
      providers: [
        { provide: ProviderService, useValue: providerServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ],
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [
            UpdateTripProviderModalComponent
          ]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(TripAwaitingProviderComponent);
    component = fixture.debugElement.componentInstance;
    component.tripRequestType = 'awaitingProvider';
    // This provides the component under test with trips to
    // ensure the component template body is rendered
    component.tripRequests = [tripRequestMock];
    fixture.detectChanges();

    mockElement =  {
      list: ['edit-icon', 'confirm-icon'],
      classList: {
        contains: (value) => {
          if (mockElement.list.includes(value)) {return true; }
          return false;
        }
      }
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should open update provider modal', () => {
    const dialogSpy = jest.spyOn(MatDialog.prototype, 'open');
    component.ngOnInit();
    fixture.detectChanges();
    const editButton = fixture.debugElement.query(By.css('.edit-action-button'));
    editButton.triggerEventHandler('click', null);
    expect(dialogSpy).toHaveBeenCalledTimes(1);
  });

  it('should get providers not assigned to the trip', () => {
    component.tripProviders = providersMock;
    const providers = component.getProvidersNotAssignedToThisTrip(tripRequestMock);
    expect(providers.length).toEqual(1);
  });

  it('should call providerService getViableProviders method', () => {
    jest.spyOn(component.providerService, 'getViableProviders').mockReturnValue(of({ data: {
      providers: []
    }}));
    component.ngOnInit();
    expect(component.providerService.getViableProviders).toBeCalled();
  });

  it('should test for an action button click status', () => {
    component.tripTableActionButtons = ['edit-icon'];
    const actionBtnClicked = component.isActionButton(mockElement);
    expect(actionBtnClicked).toEqual(true);
  });

  it('should test for an action button click status', () => {
    component.tripTableActionButtons = ['decline-icon'];
    const actionBtnClicked = component.isActionButton(mockElement);
    expect(actionBtnClicked).toEqual(false);
  });
});
