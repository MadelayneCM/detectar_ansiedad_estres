export interface Consulta {
    id_consulta: number;
    id_doctor: number;
    id_paciente: number;
    con_fecha: string;
    con_atributos: any; //Record<string, any>;  // Un objeto con claves dinámicas se pupede cambiar a esto hay que probar 
    con_estado: string;
    con_tratamiento: string;
}

export interface ConsultaPorCedula {
    fecha_consulta: string;
    cedula_paciente: string;
    nombre_paciente: string;
    tipo_diagnostico: string;
    estado: string;
    atributos: any; // o Record<string, any> si quieres ser más estricto
    nombre_doctor: string;
    tratamiento: string;
}
