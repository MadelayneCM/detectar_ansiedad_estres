import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons,
  IonItem, IonLabel,IonSelectOption,  IonDatetime, IonInput, IonSelect
 } from '@ionic/angular/standalone';
 import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-registro-paciente',
  templateUrl: './registro-paciente.page.html',
  styleUrls: ['./registro-paciente.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,  IonDatetime, IonInput, IonSelect,
     IonButton, IonIcon, IonItem, IonLabel,IonSelectOption,  CommonModule, FormsModule, ReactiveFormsModule ]
})
export class RegistroPacientePage implements OnInit {


  
    
pacientes: any[] = [];
medicoActivo: any = null;
isEdit: boolean = false;
origen: string | null = null;

  


     ionViewWillEnter() {
  this.cargarPacientes();
    this.verificarSesion();
  }

  nuevoPaciente: {
  id?: number;       // <--- aquí
  cedula: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  genero: string;
  tipoSangre: string;
  correo: string;
} = {
  cedula: '',
  nombre: '',
  apellido: '',
  fechaNacimiento: '',
  genero: '',
  tipoSangre: '',
  correo: ''
};

  private cargarPacientes() {
  const datosGuardados = localStorage.getItem('pacientesHistorial');
  if (datosGuardados) {
    let pacientes = JSON.parse(datosGuardados);

    pacientes = pacientes.map((p: any) => ({
      ...p,
      id: p.id ?? Date.now() + Math.random()
    }));

    this.pacientes = pacientes;
    localStorage.setItem('pacientesHistorial', JSON.stringify(this.pacientes));
  }
}

  private verificarSesion() {
    const sesion = localStorage.getItem('medicoActivo');
    this.medicoActivo = sesion ? JSON.parse(sesion) : null;
  }


  constructor( private router: Router, private toastController: ToastController,   private route: ActivatedRoute) {
    
   }

  
  
  ngOnInit() {
    // Cargar pacientes guardados
    const datosGuardados = localStorage.getItem('pacientesHistorial');
    if (datosGuardados) {
      this.pacientes = JSON.parse(datosGuardados);
    }

    // Verificar sesión médico
    const sesion = localStorage.getItem('medicoActivo');
    if (sesion) {
      this.medicoActivo = JSON.parse(sesion);
    }

    // Detectar si hay parámetro id para editar
    const pacienteId = this.route.snapshot.paramMap.get('id');
    if (pacienteId) {
      this.isEdit = true;
      // Buscar paciente por id
      const pacienteEditar = this.pacientes.find(p => p.id === +pacienteId);
      if (pacienteEditar) {
        this.nuevoPaciente = {...pacienteEditar}; // Rellenar el formulario
      } else {
        // Si no existe, puedes redirigir o mostrar error
        this.router.navigate(['/historial-pacientes']);
      }
    }
     // 🔹 Leer el origen desde queryParams
      // this.origen = this.route.snapshot.queryParamMap.get('origen');
       this.origen = history.state.origen || null;
  console.log('Origen:', this.origen);


  }



   cerrarSesion() {
  localStorage.removeItem('medicoActivo');
  this.router.navigate(['/login-medico']);
  }

//   regresar(){
//   this.router.navigate(['/formulario-diagnostico'])
// }
regresar() {
  // if (this.origen === '/formulario-diagnostico') {
  //   this.router.navigate(['/formulario-diagnostico']);
  // } else {
  //   this.router.navigate(['/pacientes']);
  // }
  if(this.origen === 'formulario-diagnostico') {
    this.router.navigate(['/formulario-diagnostico']);
  } else if (this.origen === 'pacientes') {
    this.router.navigate(['/pacientes']);
  } else {
    // Por si no llega nada, redirigir a una ruta por defecto
    this.router.navigate(['/']);
  }
}



async guardarPaciente() {
  if (this.isEdit) {
    // Editar paciente existente
    const data = localStorage.getItem('pacientesHistorial');
    let pacientes = data ? JSON.parse(data) : [];

    pacientes = pacientes.map((p: any) => p.id === this.nuevoPaciente.id ? this.nuevoPaciente : p);

    localStorage.setItem('pacientesHistorial', JSON.stringify(pacientes));

    const toast = await this.toastController.create({
      message: '✏️ Paciente editado exitosamente.',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
      this.router.navigate(['pacientes']);

  } else {
    // Agregar paciente nuevo
    this.nuevoPaciente.id = Date.now();
    const data = localStorage.getItem('pacientesHistorial');
    const pacientes = data ? JSON.parse(data) : [];
    pacientes.push(this.nuevoPaciente);
    localStorage.setItem('pacientesHistorial', JSON.stringify(pacientes));

    const toast = await this.toastController.create({
      message: '✅ Paciente agregado exitosamente.',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
  }
  // this.router.navigate(['/historial-pacientes']);
}


}
