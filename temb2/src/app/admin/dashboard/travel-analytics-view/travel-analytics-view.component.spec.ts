import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularMaterialModule } from 'src/app/angular-material.module';

import { TravelAnalyticsViewComponent } from './travel-analytics-view.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('AirportTransfersViewComponent', () => {
  let component: TravelAnalyticsViewComponent;
  let fixture: ComponentFixture<TravelAnalyticsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelAnalyticsViewComponent ],
      imports: [AngularMaterialModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelAnalyticsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
