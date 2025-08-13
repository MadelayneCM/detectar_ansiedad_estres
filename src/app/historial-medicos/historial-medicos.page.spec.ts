import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialMedicosPage } from './historial-medicos.page';

describe('HistorialMedicosPage', () => {
  let component: HistorialMedicosPage;
  let fixture: ComponentFixture<HistorialMedicosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialMedicosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
