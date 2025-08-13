import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResultadoDiagnosticoModalComponent } from './resultado-diagnostico-modal.component';

describe('ResultadoDiagnosticoModalComponent', () => {
  let component: ResultadoDiagnosticoModalComponent;
  let fixture: ComponentFixture<ResultadoDiagnosticoModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultadoDiagnosticoModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultadoDiagnosticoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
