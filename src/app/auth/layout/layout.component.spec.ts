import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import LayoutComponent from './layout.component';

describe('Auth LayoutComponent - unitaria', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent, RouterTestingModule],
    }).compileComponents();
  });

  it('debe crearse el componente', () => {
    const fixture = TestBed.createComponent(LayoutComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
