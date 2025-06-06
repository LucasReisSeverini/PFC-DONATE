import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BancoProximoComponent } from './banco-proximo.component';

describe('BancoProximoComponent', () => {
  let component: BancoProximoComponent;
  let fixture: ComponentFixture<BancoProximoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BancoProximoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BancoProximoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
