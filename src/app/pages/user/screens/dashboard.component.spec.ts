import { TestBed } from '@angular/core/testing';
import DashboardComponent from './dashboard.component';

describe('DashboardComponent - unitaria', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
    }).compileComponents();
  });

  it('debe crearse el componente', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
