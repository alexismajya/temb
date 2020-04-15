import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AverageTripRatingsComponent } from './average-trip-ratings.component';

describe('AverageTripRatingsComponent', () => {
  let component: AverageTripRatingsComponent;
  let fixture: ComponentFixture<AverageTripRatingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AverageTripRatingsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AverageTripRatingsComponent);
    component = fixture.componentInstance;
    component.avgRatings = 3.4;
    component.title = 'Average Trip Rating';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
