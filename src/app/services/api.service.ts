import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente, PacienteDatos } from '../interfaces/interfacePaciente';
import { Doctor } from '../interfaces/interfaceDoctor'; // Asegúrate de tener esta interfaz definida
import { ConsultaPorCedula, GuardarConsultaRequest, GuardarConsultaResponse } from '../interfaces/interfaceConsulta'; // Asegúrate de tener esta interfaz definida
import { AtributosEntrada, ResultadoPrediccion, AtributosEntradaAnsiedd, ResultadoPrediccionAnsiedad } from '../interfaces/interfacePrediccionEstres'; // Asegúrate de tener esta interfaz definida
@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private baseUrl = 'http://localhost:8000/api'; // Ajusta según tu URL

  constructor(private http: HttpClient) { }

  // PACIENTES
  //obtiene todos los pacientes
  getPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.baseUrl}/pacientes`);
  }

  //obtiene los pacientes por cedula solo nombre y apellido
  getPacientePorCedulaNomApe(cedula: string): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.baseUrl}/pacientes/bucarPacienteDatos/${cedula}`);
  }

  //obtiene los pacientes por cedula con todos los datos
  getPacientePorCedulaDatos(cedula: string): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.baseUrl}/pacientes/buscarPacienteCed/${cedula}`);
  }

  //Obtiene paciente por Cedula (nombre/apellido/fechanac)
  getPacienteCedulaDatos(cedula: string): Observable<PacienteDatos> {
    return this.http.get<PacienteDatos>(`${this.baseUrl}/pacientes/obtenerPaciente/${cedula}`);
  }

  getPacienteId(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.baseUrl}/pacientes/${id}`);
  }

  //crear un nuevo paciente
  crearPaciente(paciente: Paciente): Observable<Paciente> {
    return this.http.post<Paciente>(`${this.baseUrl}/pacientes`, paciente);
  }

  //actualiza un paciente por id
  actualizarPaciente(id: number, paciente: Partial<Paciente>): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.baseUrl}/pacientes/${id}`, paciente);
  }

  // DOCTORES
  getDoctores(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.baseUrl}/doctores`);
  }

  getDoctorId(id: number): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.baseUrl}/doctores/${id}`);
  }

  crearDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.baseUrl}/doctores`, doctor);
  }

  actualizarDoctor(id: number, doctor: Partial<Doctor>): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.baseUrl}/doctores/${id}`, doctor);
  }

  login(correo: string, clave: string): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.baseUrl}/doctores/login`, { correo, clave });
  }

  cambiarEstadoDoctor(id: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/doctores/cambiarEstado/${id}`, {});
  }

  //consultaPorCedula edvuelve la misma estructura que necesito
  listarConsultas(): Observable<ConsultaPorCedula[]> {
    return this.http.get<ConsultaPorCedula[]>(`${this.baseUrl}/consultas/consultasCompletas`);
  }

  listarConsultasPorCedula(cedula: string): Observable<ConsultaPorCedula[]> {
    return this.http.get<ConsultaPorCedula[]>(`${this.baseUrl}/consultas/porCedula/${cedula}`);
  }

  //PREDICCION ESTRES
   predecirEstres(datos: AtributosEntrada): Observable<ResultadoPrediccion> {
    return this.http.post<ResultadoPrediccion>(`${this.baseUrl}/estres/predict`, datos);
  }

  //PREDICCION ANSIEDAD
  predecirAnsiedad(datos: AtributosEntradaAnsiedd): Observable<ResultadoPrediccionAnsiedad> {
    return this.http.post<ResultadoPrediccionAnsiedad>(`${this.baseUrl}/ansiedad/predict`, datos);
  }

  // CONSULTA
  guardarConsulta(consultaData: GuardarConsultaRequest): Observable<GuardarConsultaResponse> {
    return this.http.post<GuardarConsultaResponse>(
      `${this.baseUrl}/consultas/guardarConsulta`, 
      consultaData
    );
  }

}
