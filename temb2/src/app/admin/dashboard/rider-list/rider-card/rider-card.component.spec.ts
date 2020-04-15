import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderCardComponent } from './rider-card.component';
import { ShortenTextPipe } from 'src/app/admin/__pipes__/shorten-text.pipe';

describe('RiderCardComponent', () => {
  let component: RiderCardComponent;
  let fixture: ComponentFixture<RiderCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiderCardComponent, ShortenTextPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderCardComponent);
    fixture.componentInstance.rider = { name: 'Test User', picture: 'pic', routeName: 'name'};
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
