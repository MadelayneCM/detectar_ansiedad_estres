import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialDiagnosticosPage } from './historial-diagnosticos.page';

describe('HistorialDiagnosticosPage', () => {
  let component: HistorialDiagnosticosPage;
  let fixture: ComponentFixture<HistorialDiagnosticosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialDiagnosticosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
