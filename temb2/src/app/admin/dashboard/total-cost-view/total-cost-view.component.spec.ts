import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { TotalCostViewComponent } from './total-cost-view.component';

describe('TotalCostViewComponent', () => {
  let component: TotalCostViewComponent;
  let fixture: ComponentFixture<TotalCostViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TotalCostViewComponent],
      imports: [AngularMaterialModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalCostViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
