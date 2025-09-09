import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarEventosComponent } from './gerenciar-eventos.component';

describe('GerenciarEventosComponent', () => {
  let component: GerenciarEventosComponent;
  let fixture: ComponentFixture<GerenciarEventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarEventosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciarEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
