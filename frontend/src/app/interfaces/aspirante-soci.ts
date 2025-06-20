export class AspiranteSoci {

    aov_id: string = "";
    aov_aspirante: string = "";
    aov_iess_clave: string = "";
    aov_banco_nombre: string = "";
    aov_banco_cuenta: string = "";
    aov_serv_agua: string = "NO";
    aov_serv_electico: string = "NO";
    aov_serv_alcantarilla: string = "NO";
    aov_serv_transporte: string = "TRANSPORTE PUBLICO";
    aov_ingresos: number = 0.00;
    aov_ingresos_otros: number = 0.00;
    aov_gastos: number = 0.00;
    aov_vivienda: string = "";
    aov_construccion: string = "";
    aov_descripcion_vivienda: string = "";
    aov_familiares: string = "";
    aov_familiar: string = "";
    aov_responsable: string = "";
    aov_contacto_causa: string = "";
    // aov_url_archivo1: string = "";
    // aov_url_archivo2: string = "";
    //nuevo();

}

export class AspiranteFamiliar {
    nombre: string = "";
    parentezco: string = "";
    telefono: string = "";
    direccion: string = "";
    vivienda: string = "";
    referencia: string = "";
}

export class AspiranteCarga {
    nombres: string = "";
    apellidos: string = "";
    sexo: string = "MASCULINO";
    nacimiento: string = "";
    parentezco: string = "";
    nivel: string = "PRIMARIA";
    grado: string = "1";
    estudiando: boolean = false;
    trabajando: boolean = false;
    otros: string = "";
}