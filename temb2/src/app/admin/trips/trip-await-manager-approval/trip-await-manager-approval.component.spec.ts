import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestModule } from 'src/app/__tests__/testing.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TripAwaitManagerApprovalComponent } from './trip-await-manager-approval.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ShortenTextPipe } from '../../__pipes__/shorten-text.pipe';
import { ShortenNamePipe } from '../../__pipes__/shorten-name.pipe';

describe('TripAwaitManagerApprovalComponent', () => {
  let component: TripAwaitManagerApprovalComponent;
  let fixture: ComponentFixture<TripAwaitManagerApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripAwaitManagerApprovalComponent,
        ShortenTextPipe,
        ShortenNamePipe
      ],
      imports: [ AppTestModule ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: MatDialog, useValue: {
            data: {
              tripInfo: {},
              closeText: 'close'
            }
          }
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripAwaitManagerApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
