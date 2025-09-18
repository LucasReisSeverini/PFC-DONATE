import { TestBed } from '@angular/core/testing';

import { ControleAgendamentoService } from './controle-agendamento.service';

describe('ControleAgendamentoService', () => {
  let service: ControleAgendamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControleAgendamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
