import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactFilterComponent } from './contact-filter.component';

describe('ContactFilterComponent', () => {
  let component: ContactFilterComponent;
  let fixture: ComponentFixture<ContactFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
