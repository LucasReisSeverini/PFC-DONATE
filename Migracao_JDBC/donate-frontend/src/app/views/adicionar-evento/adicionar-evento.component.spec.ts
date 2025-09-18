import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionarEventoComponent } from './adicionar-evento.component';

describe('AdicionarEventoComponent', () => {
  let component: AdicionarEventoComponent;
  let fixture: ComponentFixture<AdicionarEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdicionarEventoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdicionarEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
