import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosViewsComponent } from './eventos-views.component';

describe('EventosViewsComponent', () => {
  let component: EventosViewsComponent;
  let fixture: ComponentFixture<EventosViewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventosViewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventosViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
