import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventoComponent } from './edit-evento.component';

describe('EditEventoComponent', () => {
  let component: EditEventoComponent;
  let fixture: ComponentFixture<EditEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEventoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
