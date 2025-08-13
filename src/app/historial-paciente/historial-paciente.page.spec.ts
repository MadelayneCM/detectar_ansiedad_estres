import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialPacientePage } from './historial-paciente.page';

describe('HistorialPacientePage', () => {
  let component: HistorialPacientePage;
  let fixture: ComponentFixture<HistorialPacientePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialPacientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
