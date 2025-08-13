import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormularioDiagnosticoPage } from './formulario-diagnostico.page';

describe('FormularioDiagnosticoPage', () => {
  let component: FormularioDiagnosticoPage;
  let fixture: ComponentFixture<FormularioDiagnosticoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioDiagnosticoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
