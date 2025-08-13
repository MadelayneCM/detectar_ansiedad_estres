import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonRadioGroup,IonContent, IonHeader, IonRadio,IonTitle, IonToolbar, IonItem, IonLabel,
   IonButton, IonInput, IonIcon, IonButtons, IonText} from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { ViewChild,TemplateRef } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { ResultadoDiagnosticoModalComponent } from 'src/app/resultado-diagnostico-modal/resultado-diagnostico-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario-diagnostico',
  templateUrl: './formulario-diagnostico.page.html',
  styleUrls: ['./formulario-diagnostico.page.scss'],
  standalone: true,
  imports: [IonRadioGroup,ReactiveFormsModule,IonContent, IonHeader,IonRadio, IonTitle, IonIcon,IonToolbar, IonItem,IonLabel, 
    IonInput,IonButton,CommonModule, FormsModule, ResultadoDiagnosticoModalComponent, IonButtons, IonText]
})
export class FormularioDiagnosticoPage implements OnInit {

      tabSeleccionado: string = 'diagnostico';

        medicos: any[] = [];
    medicoActivo: any = null;
      cedulaBuscar: string = '';
  pacienteEncontrado: any = null;

     // Se ejecuta cada vez que entras a esta página
  ionViewWillEnter() {
    this.cargarMedicos();
    this.verificarSesion();
    
  }


  private cargarMedicos() {
    const datosGuardados = localStorage.getItem('medicosHistorial');
    if (datosGuardados) {
      let medicos = JSON.parse(datosGuardados);

      medicos = medicos.map((m: any) => ({
        ...m,
        id: m.id ?? Date.now() + Math.random()
      }));

      this.medicos = medicos;
      localStorage.setItem('medicosHistorial', JSON.stringify(this.medicos));
    }
  }

  private verificarSesion() {
    const sesion = localStorage.getItem('medicoActivo');
    this.medicoActivo = sesion ? JSON.parse(sesion) : null;
  }



    @ViewChild('alertTemplate', { static: true }) alertTemplate!: TemplateRef<any>;


  nombrePaciente = '';
  edad: any = '';
  fecha = '';
  emg: any = '';
  ecg: any = '';
  resp: any = '';
  temp: any = '';
  eda: any = '';
  tipoDiagnostico: string = '';
  tratamiento: string = '';


  diagnosticoGenerado: boolean = false;
  estado: string = '';




  constructor( private alertController: AlertController, private modalController: ModalController, private router: Router) { }

  // ngOnInit() {
  // }

  ngOnInit() {
  // 1. Cargar médicos del localStorage
  const datosGuardados = localStorage.getItem('medicosHistorial');
  if (datosGuardados) {
    let medicos = JSON.parse(datosGuardados);

    // Asegurar que todos tengan ID único
    medicos = medicos.map((m: any) => ({
      ...m,
      id: m.id ?? Date.now() + Math.random()
    }));

    this.medicos = medicos;
    localStorage.setItem('medicosHistorial', JSON.stringify(this.medicos));
  }

  // 2. Verificar si hay médico logueado
  const sesion = localStorage.getItem('medicoActivo');
  if (sesion) {
    this.medicoActivo = JSON.parse(sesion);
  }
}


   private esNumeroValido(valor: any): boolean {
    const num = Number(valor);
    return valor !== null && valor !== '' && valor !== undefined && !isNaN(num);
  }

detectarEstado(): string {
    const emg = Number(this.emg);
    const ecg = Number(this.ecg);
    const resp = Number(this.resp);
    const temp = Number(this.temp);
    const eda = Number(this.eda);

    if (this.tipoDiagnostico === 'estres') {
      if (emg > 50 || ecg > 100 || eda > 5) {
        return 'Estrés';
      } else {
        return 'Normal';
      }
    }

    if (this.tipoDiagnostico === 'ansiedad') {
      if (temp < 36 && resp > 20) {
        return 'Ansiedad';
      } else {
        return 'Normal';
      }
    }

    return 'Desconocido';
  }
  
  async mostrarResultado() {
  if (!this.tipoDiagnostico) {
    const alerta = await this.alertController.create({
      header: 'Diagnóstico no seleccionado',
      message: 'Por favor selecciona si deseas diagnosticar estrés o ansiedad.',
      buttons: ['OK'],
    });
    await alerta.present();
    return;
  }

  this.nombrePaciente= String(this.nombrePaciente);
  // this.edad = Number(this.edad);
  this.emg = Number(this.emg);
  this.ecg = Number(this.ecg);
  this.resp = Number(this.resp);
  this.temp = Number(this.temp);
  this.eda = Number(this.eda);

  if (
    // !this.nombrePaciente.trim() ||
    // !this.esNumeroValido(this.edad) ||
    (this.tipoDiagnostico === 'estres' && !this.esNumeroValido(this.emg)) ||
    !this.esNumeroValido(this.ecg) ||
    !this.esNumeroValido(this.resp) ||
    !this.esNumeroValido(this.temp) ||
    !this.esNumeroValido(this.eda)
  ) {
    const alerta = await this.alertController.create({
      header: 'Campos incompletos',
      message: 'Por favor completa todos los campos con datos válidos.',
      buttons: ['OK'],
    });
    await alerta.present();
    return;
  }

  const estado = this.detectarEstado();

  // ✅ Guardar en localStorage
  const nuevoDiagnostico = {
    nombre: this.nombrePaciente,
    fechaNacimiento: this.pacienteEncontrado?.fechaNacimiento || '', // 👈 Guardar fecha nacimiento
    tipo: this.tipoDiagnostico,
    fecha: new Date().toLocaleDateString(),
    emg: this.tipoDiagnostico === 'estres' ? this.emg : null,
    ecg: this.ecg,
    resp: this.resp,
    temp: this.temp,
    eda: this.eda,
    estado: estado,
    // medico: this.medicoActivo ? this.medicoActivo.nombre : 'Desconocido',
    medico: this.medicoActivo
  ? `${this.medicoActivo.nombre} ${this.medicoActivo.apellido}`
  : 'Desconocido',
    

  };

  const previos = localStorage.getItem('diagnosticos');
  const diagnosticos = previos ? JSON.parse(previos) : [];
  diagnosticos.push(nuevoDiagnostico);
  localStorage.setItem('diagnosticos', JSON.stringify(diagnosticos));

  // ✅ Mostrar modal
  const modal = await this.modalController.create({
    component: ResultadoDiagnosticoModalComponent,
    componentProps: {
      nombrePaciente: this.nombrePaciente,
      estado: estado
    }
  });
  await modal.present();

  // 🧼 Limpiar formulario
  this.nombrePaciente = '';
  this.edad = '';
  this.tipoDiagnostico = '';
  this.emg = '';
  this.ecg = '';
  this.resp = '';
  this.temp = '';
  this.eda = '';
  this.diagnosticoGenerado = true;
  this.estado = estado;

}
  
  goToHistorial() {
  this.router.navigate(['/historial-diagnostico']);
  }
  goToDash() {
  this.router.navigate(['/dashboard']);
  }

  seleccionarTab(tab: string) {
    this.tabSeleccionado = tab;
    this.router.navigate([`/${tab}`]);
  }

  

  cerrarSesion() {
  localStorage.removeItem('medicoActivo');
  this.router.navigate(['/login-medico']);
  }

  guardarConTratamiento() {
  const diagnosticos = JSON.parse(localStorage.getItem('diagnosticos') || '[]');

  // Encuentra el último diagnóstico (el más reciente)
  const ultimo = diagnosticos[diagnosticos.length - 1];

  if (ultimo) {
    ultimo.tratamiento = this.tratamiento;
    localStorage.setItem('diagnosticos', JSON.stringify(diagnosticos));
    this.tratamiento = '';
    this.diagnosticoGenerado = false;
    this.estado = '';

    this.alertController.create({
      header: '✅ Tratamiento Guardado',
      message: 'El tratamiento ha sido guardado exitosamente junto al diagnóstico.',
      buttons: ['OK']
    }).then(alert => alert.present());
  }
}
 // Simula búsqueda en localStorage
  // buscarPaciente() {
  //   const pacientesData = localStorage.getItem('pacientesHistorial');
  //   const pacientes = pacientesData ? JSON.parse(pacientesData) : [];

  //   this.pacienteEncontrado = pacientes.find((p: any) => p.cedula === this.cedulaBuscar);

  //   if (!this.pacienteEncontrado) {
  //     this.mostrarAlertaPacienteNoEncontrado();
  //   }
  // }

  // segunda prueba
buscarPaciente() {
  const pacientesData = localStorage.getItem('pacientesHistorial');
  const pacientes = pacientesData ? JSON.parse(pacientesData) : [];

  // Buscar por coincidencia exacta
  const encontrado = pacientes.find((p: any) => p.cedula === this.cedulaBuscar);

  if (encontrado) {
    this.pacienteEncontrado = encontrado;
    // Rellenar automáticamente el nombre
    this.nombrePaciente = `${encontrado.nombre} ${encontrado.apellido}`;
  } else {
    this.pacienteEncontrado = null;
    this.mostrarAlertaPacienteNoEncontrado();
  }
}



  async mostrarAlertaPacienteNoEncontrado() {
    const alert = await this.alertController.create({
      header: 'Paciente no encontrado',
      message: 'El paciente no se encuentra, ¿deseas ingresarlo?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          // handler: () => {
          //   this.router.navigate(['/registro-paciente']);  // ajusta esta ruta según tu configuración
          // }
          handler: () => {
  this.router.navigate(['/registro-paciente'], { state: { origen: 'formulario-diagnostico' } });
}

        }
      ]
    });
    await alert.present();
  }


}
