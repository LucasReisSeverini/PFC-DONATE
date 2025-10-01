import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MunicipioCreateComponent } from './municipio-create.component';

describe('MunicipioCreateComponent', () => {
  let component: MunicipioCreateComponent;
  let fixture: ComponentFixture<MunicipioCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MunicipioCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MunicipioCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
