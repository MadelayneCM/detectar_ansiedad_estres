import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarMedicoPage } from './agregar-medico.page';

describe('AgregarMedicoPage', () => {
  let component: AgregarMedicoPage;
  let fixture: ComponentFixture<AgregarMedicoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarMedicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
