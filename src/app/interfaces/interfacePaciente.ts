export interface Paciente {
    id_paciente: number;
    pac_cedula: string;
    pac_nombre: string;
    pac_apellido: string;
    pac_fecnac: string;
    pac_genero: string;
    pac_tiposangre: string;
    pac_correo: string;
}

export interface PacienteDatos {
  nombre: string;
  apellido: string;
  fechanac: string;
}
