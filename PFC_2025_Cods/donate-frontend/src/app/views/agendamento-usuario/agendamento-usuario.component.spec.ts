import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendamentoUsuarioComponent } from './agendamento-usuario.component';

describe('AgendamentoUsuarioComponent', () => {
  let component: AgendamentoUsuarioComponent;
  let fixture: ComponentFixture<AgendamentoUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendamentoUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendamentoUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
