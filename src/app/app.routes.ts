import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'formulario-diagnostico',
    loadComponent: () => import('./pages/formulario-diagnostico/formulario-diagnostico.page').then( m => m.FormularioDiagnosticoPage)
  },
  {
    path: 'historial-diagnostico',
    loadComponent: () => import('./historial-diagnosticos/historial-diagnosticos.page').then( m => m.HistorialDiagnosticosPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'inicio',
    loadComponent: () => import('./inicio/inicio.page').then( m => m.InicioPage)
  },
  {
    path: 'historial-medicos',
    loadComponent: () => import('./historial-medicos/historial-medicos.page').then( m => m.HistorialMedicosPage)
  },
  {
    path: 'editar-medico',
    loadComponent: () => import('./editar-medico/editar-medico.page').then( m => m.EditarMedicoPage)
  },
  {
    path: 'agregar-medico',
    loadComponent: () => import('./agregar-medico/agregar-medico.page').then( m => m.AgregarMedicoPage)
  },
  {
    path: 'login-medico',
    loadComponent: () => import('./login-medico/login-medico.page').then( m => m.LoginMedicoPage)
  },
  {
    path: 'historial-paciente',
    loadComponent: () => import('./historial-paciente/historial-paciente.page').then( m => m.HistorialPacientePage)
  },
  {
    path: 'registro-paciente',
    loadComponent: () => import('./registro-paciente/registro-paciente.page').then( m => m.RegistroPacientePage)
  },
  {
    path: 'registro-paciente/:id',
    loadComponent: () => import('./registro-paciente/registro-paciente.page').then( m => m.RegistroPacientePage)
  },
  {
    path: 'pacientes',
    loadComponent: () => import('./pacientes/pacientes.page').then( m => m.PacientesPage)
  },
];
