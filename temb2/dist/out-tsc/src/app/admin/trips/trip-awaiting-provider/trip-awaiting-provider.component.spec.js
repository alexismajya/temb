var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
import { TestBed } from '@angular/core/testing';
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
describe('TripAwaitingProviderComponent Unit test', function () {
    var component;
    var fixture;
    var mockElement;
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
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
            mockElement = {
                list: ['edit-icon', 'confirm-icon'],
                classList: {
                    contains: function (value) {
                        if (mockElement.list.includes(value)) {
                            return true;
                        }
                        return false;
                    }
                }
            };
            return [2 /*return*/];
        });
    }); });
    afterEach(function () {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should create component', function () {
        expect(component).toBeTruthy();
    });
    it('should open update provider modal', function () {
        var dialogSpy = jest.spyOn(MatDialog.prototype, 'open');
        component.ngOnInit();
        fixture.detectChanges();
        var editButton = fixture.debugElement.query(By.css('.edit-action-button'));
        editButton.triggerEventHandler('click', null);
        expect(dialogSpy).toHaveBeenCalledTimes(1);
    });
    it('should get providers not assigned to the trip', function () {
        component.tripProviders = providersMock;
        var providers = component.getProvidersNotAssignedToThisTrip(tripRequestMock);
        expect(providers.length).toEqual(1);
    });
    it('should call providerService getViableProviders method', function () {
        jest.spyOn(component.providerService, 'getViableProviders').mockReturnValue(of({ data: {
                providers: []
            } }));
        component.ngOnInit();
        expect(component.providerService.getViableProviders).toBeCalled();
    });
    it('should test for an action button click status', function () {
        component.tripTableActionButtons = ['edit-icon'];
        var actionBtnClicked = component.isActionButton(mockElement);
        expect(actionBtnClicked).toEqual(true);
    });
    it('should test for an action button click status', function () {
        component.tripTableActionButtons = ['decline-icon'];
        var actionBtnClicked = component.isActionButton(mockElement);
        expect(actionBtnClicked).toEqual(false);
    });
});
//# sourceMappingURL=trip-awaiting-provider.component.spec.js.map