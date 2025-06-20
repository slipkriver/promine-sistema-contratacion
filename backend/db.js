const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

function init() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS aspirantes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      asp_id TEXT,
      asp_cedula TEXT,
      asp_codigo TEXT,
      asp_nombres TEXT,
      asp_apellidop TEXT,
      asp_apellidom TEXT,
      asp_pais TEXT,
      asp_sexo TEXT,
      asp_edad TEXT,
      asp_correo TEXT,
      asp_ecivil TEXT,
      asp_gpo_sanguineo TEXT,
      asp_cargo TEXT,
      asp_cargo_area TEXT,
      asp_sueldo TEXT,
      asp_conadis TEXT,
      asp_nro_conadis TEXT,
      asp_discapacidad TEXT,
      asp_porcentaje TEXT,
      asp_sustituto TEXT,
      asp_sustituto_cedula TEXT,
      asp_sustituto_nombre TEXT,
      asp_sustituto_parentesco TEXT,
      asp_experiencia TEXT,
      asp_nmb_experiencia TEXT,
      asp_ing_entrevista TEXT,
      asp_fch_ingreso TEXT,
      asp_telefono TEXT,
      asp_direccion TEXT,
      asp_hora_entrevista TEXT,
      asp_referencia TEXT,
      asp_jefe_area TEXT,
      asp_estado INTEGER,
      asp_observaciones TEXT,
      asp_titulo_nombre TEXT,
      asp_observacion_final TEXT,
      asp_academico TEXT,
      asp_fecha_nacimiento TEXT,
      asp_militar TEXT,
      asp_aprobacion INTEGER,
      asp_evaluacion TEXT,
      asp_condicion TEXT,
      asp_lugar_nacimiento TEXT,
      asp_etnia TEXT,
      asp_religion TEXT,
      asp_recomendado TEXT,
      asp_url_foto TEXT,
      atv_aspirante TEXT,
      atv_fingreso TEXT,
      atv_fverificado INTEGER,
      atv_plegales INTEGER,
      atv_pfiscalia INTEGER,
      atv_ppenales INTEGER,
      atv_plaborales INTEGER,
      atv_verificado INTEGER,
      atv_observacion TEXT,
      usuario TEXT
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS aspirante_soci (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aov_id TEXT,
      aov_aspirante TEXT,
      aov_iess_clave TEXT,
      aov_banco_nombre TEXT,
      aov_banco_cuenta TEXT,
      aov_serv_agua TEXT,
      aov_serv_electico TEXT,
      aov_serv_alcantarilla TEXT,
      aov_serv_transporte TEXT,
      aov_ingresos REAL,
      aov_ingresos_otros REAL,
      aov_gastos REAL,
      aov_vivienda TEXT,
      aov_construccion TEXT,
      aov_descripcion_vivienda TEXT,
      aov_familiares TEXT,
      aov_familiar TEXT,
      aov_responsable TEXT,
      aov_contacto_causa TEXT
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS empleados (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      emp_nombres TEXT,
      emp_apellidos TEXT,
      emp_cedula TEXT,
      emp_codigo TEXT,
      emp_nacion TEXT,
      emp_sexo TEXT,
      emp_edad TEXT,
      emp_civil TEXT,
      emp_departamento TEXT
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uid TEXT,
      email TEXT,
      session TEXT,
      lastlogin TEXT,
      displayname TEXT,
      role TEXT,
      iplogin TEXT,
      photo TEXT,
      password TEXT
    );`);
  });
}

module.exports = { db, init };
