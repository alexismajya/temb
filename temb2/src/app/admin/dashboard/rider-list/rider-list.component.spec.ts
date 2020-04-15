import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderListComponent } from './rider-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RiderListComponent', () => {
  let component: RiderListComponent;
  let fixture: ComponentFixture<RiderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiderListComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
