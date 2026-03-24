import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeBookComponent } from './income-book.component';

describe('IncomeBookComponent', () => {
  let component: IncomeBookComponent;
  let fixture: ComponentFixture<IncomeBookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncomeBookComponent]
    });
    fixture = TestBed.createComponent(IncomeBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
