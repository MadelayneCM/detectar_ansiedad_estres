import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarMedicoPage } from './editar-medico.page';

describe('EditarMedicoPage', () => {
  let component: EditarMedicoPage;
  let fixture: ComponentFixture<EditarMedicoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarMedicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
