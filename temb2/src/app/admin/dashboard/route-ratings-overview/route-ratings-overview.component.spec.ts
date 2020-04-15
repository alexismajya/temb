import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouteRatingsOverviewComponent } from './route-ratings-overview.component';
import { mockRouteRatings } from './ratingsMockData';
import { ShortenTextPipe } from '../../__pipes__/shorten-text.pipe';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler/src/core';


describe('RouteRatingsOverviewComponent', () => {
  let component: RouteRatingsOverviewComponent;
  let fixture: ComponentFixture<RouteRatingsOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortenTextPipe, RouteRatingsOverviewComponent ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteRatingsOverviewComponent);
    component = fixture.componentInstance;
    component.ratings = mockRouteRatings;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
