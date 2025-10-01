import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BancoLeiteCreateComponent } from './banco-leite-create.component';

describe('BancoLeiteCreateComponent', () => {
  let component: BancoLeiteCreateComponent;
  let fixture: ComponentFixture<BancoLeiteCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BancoLeiteCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BancoLeiteCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
