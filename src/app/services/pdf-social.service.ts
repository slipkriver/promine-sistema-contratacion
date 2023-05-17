import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PdfSocialService {

  fecha = new Date()
  fechastr = this.fecha.toISOString().substring(0, 10)
  //familiares;

  constructor() { }

  cuerpoDecimos(aspirante, documento) {

    const options: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const fecha = new Date().toLocaleString('es-EC', options);

    let cuerpo = JSON.stringify(documento.doc_cuerpo)
      .replace('{asp_cedula}', '"},{ "text": "' + aspirante.asp_cedula + '", "bold":true}, { "text":"')
      .replace('{asp_nombre}', '"},{ "text": "' + aspirante.asp_nombre + '", "bold":true}, { "text":"')
      .replace('{asp_cargo}', '"},{ "text": "' + aspirante.asp_cargo + '", "bold":true }, { "text":"');
    cuerpo = '[{"text":' + cuerpo + ',"alignment":"justify"}]';
    // console.log(cuerpo);

    const pagina =
    {
      content: [
        {
          style: "interline",
          alignment: "justify",
          texto: [
            "HOLa Mundo",
            { text: "hola" }
          ],
          text: [
            {
              text: `Camilo Ponce Enriquez, sector La Lopez.\n ${fecha} \n\n\n`,
              alignment: 'right',
            },
            {
              text: `${documento.doc_titulo} \n\n`,
              style: 'header',
              alignment: 'center'
            },
            {
              text: `${documento.doc_dirigido}\n`,
            },
            {
              text: `${documento.doc_dirigido_cargo}\n\n`,
              style: 'subheader'
            },
            {
              text: `Presente. \n\nDe mis consideraciones.\n\n`,
            },
            {
              text: JSON.parse(cuerpo),
            },
            {
              text: `\n\nAtentamente.\n\n\n`,
            }
          ]

        },
        {
          text: `\n${aspirante.asp_nombre}\n CI: ${aspirante.asp_cedula} \nTRABAJADOR`,
          style: 'subheader',
          alignment: 'center'
        }
      ]

    }


    //console.log(fecha, cuerpo);

    return pagina;
  }


  cuerpoPrevencion(aspirante, documento) {

    const options: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const fecha = new Date().toLocaleString('es-EC', options);

    let cuerpo = JSON.stringify(documento.doc_cuerpo)
      .replace('{asp_cedula}', '"},{ "text": "' + aspirante.asp_cedula + '", "bold":true}, { "text":"')
      .replace('{asp_nombre}', '"},{ "text": "' + aspirante.asp_nombre + '", "bold":true}, { "text":"');

    cuerpo = '[{"text":' + cuerpo + ',"alignment":"justify"}]';
    // console.log(cuerpo);

    const pagina =
    {
      content: [
        {
          style: "interline",
          alignment: "justify",
          text: [
            {
              text: `Camilo Ponce Enriquez, sector La Lopez.\n ${fecha} \n\n\n`,
              alignment: 'right',
            },
            {
              text: `${documento.doc_titulo} \n\n`,
              style: 'header',
              alignment: 'center'
            },
            {
              text: JSON.parse(cuerpo),
            },
            {
              text: `\n\n\n\n`,
              lineHeight: 1.5
            }
          ]

        },
        {
          text: `\n\n${aspirante.asp_nombre}\n CI: ${aspirante.asp_cedula} \nTRABAJADOR`,
          style: 'subheader',
          alignment: 'center'
        }
      ]

    }


    //console.log(fecha, cuerpo);

    return pagina;
  }

  cuerpoDepositos(aspirante, documento) {

    const options: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const fecha = new Date().toLocaleString('es-EC', options);

    let cuerpo = JSON.stringify(documento.doc_cuerpo)
      .replace('{asp_cedula}', '"},{ "text": "' + aspirante.asp_cedula + '", "bold":true}, { "text":"')
      .replace('{asp_nombre}', '"},{ "text": "' + aspirante.asp_nombre + '", "bold":true}, { "text":"')
      .replace('{aov_banco_cuenta}', '"},{ "text": "' + aspirante.aov_banco_cuenta + '", "bold":true }, { "text":"')
      .replace('{aov_banco_nombre}', '"},{ "text": "' + aspirante.aov_banco_nombre + '", "bold":true }, { "text":"');
    cuerpo = '[{"text":' + cuerpo + ',"alignment":"justify"}]';
    // console.log(cuerpo);

    const pagina =
    {
      content: [
        {
          style: "interline",
          //font: 'Times',
          alignment: "justify",
          text: [
            {
              text: `Camilo Ponce Enriquez, sector La Lopez.\n ${fecha} \n\n\n`,
              alignment: 'right',
            },
            {
              text: `${documento.doc_titulo} \n\n`,
              style: 'header',
              alignment: 'center'
            },
            {
              text: `${documento.doc_dirigido}\n`,
            },
            {
              text: `${documento.doc_dirigido_cargo}\n\n`,
              style: 'subheader'
            },
            {
              text: `Presente. \n\n\nDe mis consideraciones.\n\n`,
            },
            {
              text: JSON.parse(cuerpo),
            },
            {
              text: `\n\n\n\n Atentamente. \n\n\n\n`,
              lineHeight: 1.5
            }
          ]

        },
        {
          text: `\n\n${aspirante.asp_nombre}\n CI: ${aspirante.asp_cedula} \nTRABAJADOR`,
          style: 'subheader',
          alignment: 'center'
        }
      ]

    }


    //console.log(fecha, cuerpo);

    return pagina;
  }


  cuerpoFicha(aspirante, fotografia) {

    const options: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const fecha = new Date().toLocaleString('es-EC', options);

    let cuerpo = JSON.stringify(aspirante)
    const contacto1 = this.getContacto(aspirante.aov_familiar, 1)
    const contacto2 = this.getContacto(aspirante.aov_responsable, 2)
    
    const lista_familiares = JSON.parse(aspirante.aov_familiares);
    const familiares = this.getFamiliares(lista_familiares);
    // console.log(familiares.body.length);
    const pagina = {
      content: [
        {
          //colSpan: 2,
          text: 'FICHA SOCIAL\n',
          fontSize: 14,
          margin: 15,
          bold: true,
          alignment: 'center',
        },
        {
          margin: [0, 5, 0, 0],
          table: {
            widths: [100, 100, 80, 100, 90],

            body: [
              //FILA #0
              [
                {
                  text: 'A) DATOS DE IDENTIFCACION DEL TRABAJADOR',
                  //alignment: 'center',
                  bold: 'true',
                  margin: 4,
                  fillColor: '#dddddd',
                  colSpan: 5
                }, {}, {}, {}, {}
              ],

              //FILA #1
              [
                {
                  rowSpan: 4,
                  //text: 'FOTO',
                  //image: await this.getBase64ImageFromURL(aspirante.asp_url_foto.replace('..', 'https://getssoma.com') || 'assets/icon/no-person.png'),
                  image: fotografia,

                  //width: 'auto',
                  //height: 100,
                  fit: [100, 110],
                  alignment: 'center',
                  margin: [0, 0, 0, 0]
                },
                {
                  text: [
                    { text: 'Nombre\n', style: 'titulocol' },
                    // { text: 'CAMPOVERDE SALDARREAGA ANGEL FABRICIO', style:'textonormal' },
                    { text: aspirante.asp_apellidop.concat(' ', aspirante.asp_apellidom, ' ', aspirante.asp_nombres), style: 'textonormal' }
                  ],
                  colSpan: 3
                },
                {},
                {},
                {
                  text: [
                    { text: 'Ced. Identidad\n', style: 'titulocol' },
                    //{ text: '0123456789-0', style:'textonormal' }
                    { text: aspirante.asp_cedula, style: 'textonormal' }
                  ]
                },
              ],

              //FILA #2
              [
                {},
                {
                  text: [
                    { text: 'Nacionalidad\n', style: 'titulocol' },
                    // { text: 'ECUATORIANA', style:'textonormal' }
                    { text: aspirante.asp_pais, style: 'textonormal' }
                  ]
                },

                {
                  text: [
                    { text: 'Lugar de nacimiento\n', style: 'titulocol' },
                    // { text: 'ECUATORIANA', style:'textonormal' }
                    { text: aspirante.asp_lugar_nacimiento, style: 'textonormal' }
                  ],
                  colSpan: 3
                }, {}, {}
              ],

              //FILA #3
              [
                {},
                {
                  text: [
                    { text: 'Fecha de nacimiento\n', style: 'titulocol' },
                    { text: aspirante.asp_fecha_nacimiento, style: 'textonormal' }
                  ]
                },
                {
                  text: [
                    { text: 'Edad\n', style: 'titulocol' },
                    { text: '42 AÑOS', style: 'textonormal' }
                    // { text: this.getEdad(aspirante.asp_fecha_nacimiento) + ' AÑOS', style: 'textonormal' }
                  ]
                },
                {
                  text: [
                    { text: 'Estado civil\n', style: 'titulocol' },
                    // { text: 'SOLTERO', style:'textonormal' }
                    { text: aspirante.asp_ecivil, style: 'textonormal' }
                  ]
                },
                {
                  text: [
                    { text: 'Genero\n', style: 'titulocol' },
                    // { text: 'HOMBRE', style:'textonormal' }
                    { text: aspirante.asp_sexo, style: 'textonormal' }
                  ]
                }
              ],

              //FILA #4
              [
                {},
                {
                  text: [
                    { text: 'Direccion de domicilio\n', style: 'titulocol' },
                    { text: aspirante.asp_direccion, style: 'textonormal' }
                  ],
                  colSpan: 4
                }
              ],

              //FILA #5
              [
                {
                  text: [
                    { text: 'Fecha ingreso\n', style: 'titulocol' },
                    { text: aspirante.asp_fch_ingreso.substring(0, 10), style: 'textonormal' }
                    //{ text: vproductores[i].prod_ndiscapacidad }
                  ]
                },
                {
                  text: [
                    { text: 'Cod. Sectorial\n', style: 'titulocol' },
                    { text: aspirante.asp_codigo, style: 'textonormal' }
                    //{ text: aspirante.asp_etnia }
                  ],
                },
                {
                  text: [
                    { text: 'Puesto de trabajo\n', style: 'titulocol' },
                    // { text: 'OPR MINAS/LOCOMOTORA', style:'textonormal' }
                    { text: aspirante.asp_cargo.split(" - ")[0], style: 'textonormal' }
                  ],
                  colSpan: 3
                },
                {}, {}
              ],

              //FILA #6
              [
                {
                  text: [
                    { text: 'Posee experiencia\n', style: 'titulocol' },
                    // { text: 'SI', alignment: 'center', style:'textonormal' }
                    { text: (aspirante.asp_experiencia == 'SI') ? 'SI' : 'NO', style: 'textonormal' },
                  ]
                },
                {
                  text: [
                    { text: 'Correo electronico\n', style: 'titulocol' },
                    // { text: 'SI', alignment: 'center', style:'textonormal' }
                    { text: aspirante.asp_correo.toLowerCase(), style: 'textonormal' },
                  ],
                  colSpan: 2
                }, {},
                {
                  text: [
                    { text: 'Telefono movil\n', style: 'titulocol' },
                    // { text: '0994557871', style:'textonormal' }
                    { text: aspirante.asp_telefono, style: 'textonormal' }
                  ],
                },
                {
                  text: [
                    { text: 'Telf. convencional\n', style: 'titulocol' },
                    { text: aspirante.asp_telefono2, style: 'textonormal' }
                  ],
                },
              ],

              //FILA #7
              [
                {
                  text: [
                    { text: 'Nivel de educacion\n', style: 'titulocol' },
                    { text: aspirante.asp_academico, style: 'textonormal' }
                    //{ text: vproductores[i].prod_discapacidad }
                  ]
                },
                {
                  text: [
                    { text: 'Titulo obtenido\n', style: 'titulocol' },
                    { text: aspirante.asp_titulo_nombre, style: 'textonormal' }
                  ],
                  colSpan: 4
                },
                {},
                {},
                {

                },
              ],

              //FILA #8
              [
                {
                  text: [
                    { text: 'Grupo etnico\n', style: 'titulocol' },
                    { text: aspirante.asp_etnia, style: 'textonormal' }
                  ],
                },
                {
                  text: [
                    { text: 'Religion\n', style: 'titulocol' },
                    { text: aspirante.asp_religion, style: 'textonormal' }
                  ],
                },
                {
                  text: [
                    { text: 'Grupo sanguineo\n', style: 'titulocol' },
                    { text: aspirante.asp_gpo_sanguineo, style: 'textonormal' }
                  ],
                },
                {
                  text: [
                    { text: 'Recomendado por\n', style: 'titulocol' },
                    { text: aspirante.asp_referencia, style: 'textonormal' }
                  ],
                  colSpan: 2
                },
              ],

              //FILA #9
              [
                {
                  text: [
                    { text: 'Clave IESS\n', style: 'titulocol' },
                    { text: aspirante.aov_iess_clave, style: 'textonormal' }
                  ],
                },
                {
                  text: [
                    { text: 'Cuenta bancaria\n', style: 'titulocol' },
                    { text: '#' + aspirante.aov_banco_cuenta, style: 'textonormal' }
                  ],
                },
                {
                  text: [
                    { text: 'Institucion financiera\n', style: 'titulocol' },
                    { text: aspirante.aov_banco_nombre, style: 'textonormal' }
                  ],
                  colSpan: 3
                },
                {},
                {}
              ],

              //FILA #10
              [
                {
                  text: [
                    { text: 'B) DATOS DEL CONADIS' }
                  ],
                  //alignment: 'center',
                  bold: 'true',
                  margin: 4,
                  fillColor: '#dddddd',
                  colSpan: 5,
                },
              ],
              [
                {
                  text: [
                    { text: 'CONADIS\n', style: 'titulocol' },
                    // { text: '1122334455', style:'textonormal' }
                    { text: (aspirante.asp_conadis) ? aspirante.asp_conadis : 'NO', style: 'textonormal' }
                  ],
                },
                {
                  text: [
                    { text: 'Nombre discapacidad\n', style: 'titulocol' },
                    // { text: 'ANDA MEDIO CIEGO', style:'textonormal' }
                    { text: aspirante.asp_discapacidad, style: 'textonormal' }
                  ],
                  colSpan: 3
                },
                {}, {},
                {
                  text: [
                    { text: '(%)Discapacidad\n', style: 'titulocol' },
                    // { text: '64%', style:'textonormal' }
                    { text: aspirante.asp_porcentaje, style: 'textonormal' }
                  ],
                },
              ],

              //FILA #11
              [
                {
                  text: [
                    { text: 'C) FAMILIARES DE CONTACTO' }
                  ],
                  //alignment: 'center',
                  bold: 'true',
                  margin: 4,
                  fillColor: '#dddddd',
                  colSpan: 5,
                },
              ],
              [
                {
                  table: {
                    widths: ['*', 100, 100],
                    body: [
                      contacto1[0],
                      contacto1[1],
                      contacto1[2],
                      [
                        {
                          text: '',
                          margin: 4,
                          colSpan: 3,
                          border: [false, true, false, false]
                        }, {}, {}],
                      contacto2[0],
                      contacto2[1],
                      contacto2[2]
                    ]
                  }, colSpan: 5, margin: 5,
                  layout: {
                    vLineColor: function (i, node) {
                      return (i === 0 || i === node.table.widths.length) ? 'gray' : 'white';
                    },
                    hLineColor: function (i, node) {
                      return ([0, 1, 3, 4, 5, 7].includes(i)) ? 'gray' : 'lightgray';
                    }
                  }
                }, {}, {}, {}, {}
              ],

              //FILA #12
              [
                {
                  text: [
                    { text: 'D) DATOS FAMILIARES' }
                  ],
                  //alignment: 'center',
                  bold: 'true',
                  margin: 4,
                  fillColor: '#dddddd',
                  colSpan: 5,
                  pageBreak: 'before'
                },
              ],
              [
                {
                  table: familiares, colSpan: 5, margin: 5,
                  layout: {
                    vLineColor: function (i, node) {
                      return (i === 0 || i === node.table.widths.length) ? 'gray' : 'white';
                    },
                    hLineColor: function (i, node) {
                      return ([1, 4, 7, 10, 13, 16, 19].includes(i)) ? 'lightgray' : 'gray';
                    }
                  }
                }, {}, {}, {}, {}
              ],

              //FILA #13
              [
                {
                  text: [
                    { text: 'E) DATOS DE LA VIVIENDA' }
                  ],
                  //alignment: 'center',
                  bold: 'true',
                  margin: 4,
                  fillColor: '#dddddd',
                  colSpan: 5,
                }, {}, {}, {}, {}
              ],
              [
                {
                  text: [
                    { text: 'DETALLE DE LA VIVIENDA', style: 'titulocol' }
                  ],
                  alignment: 'center',
                  bold: 'true',
                  //border: [true, true, false, false],
                  fillColor: '#f0f0f0',
                  colSpan: 2,
                }, {},
                {
                  text: [
                    { text: 'SERVICIOS BASICOS', style: 'titulocol' }
                  ],
                  alignment: 'center',
                  bold: 'true',
                  //border: [true, true, false, false],
                  fillColor: '#f0f0f0',
                  colSpan: 3,
                }, {}, {}
              ],
              [
                {
                  text: [
                    { text: 'Tipo vivienda\n', style: 'titulocol' },
                    { text: aspirante.aov_vivienda, style: 'textonormal' }
                  ], border: [true, true, false, true]
                },
                {
                  text: [
                    { text: 'Construccion\n', style: 'titulocol' },
                    { text: aspirante.aov_construccion, style: 'textonormal' }
                  ], border: [false, true, true, true]
                },
                {
                  text: [
                    { text: 'Agua\n', style: 'titulocol' },
                    { text: aspirante.aov_serv_agua, style: 'textonormal' }
                  ], border: [true, true, false, true]
                },
                {
                  text: [
                    { text: 'Electricidad\n', style: 'titulocol' },
                    { text: aspirante.aov_serv_electico, style: 'textonormal' }
                  ], border: [false, true, false, true]
                }, {
                  text: [
                    { text: 'Alcantarillado\n', style: 'titulocol' },
                    { text: aspirante.aov_serv_alcantarilla, style: 'textonormal' }
                  ], border: [false, true, true, true]
                }
              ],
              [
                {
                  text: [
                    { text: 'Observaciones de la vivienda:\n', style: 'titulocol' },
                    { text: aspirante.aov_descripcion_vivienda || 'SIN OBSERVACIONES', style: 'textonormal', italics: true, fontSize: 9 }
                  ], colSpan: 5
                }, {}, {}, {}, {}
              ],

              //FILA #14
              [
                {
                  text: [
                    { text: 'F) SITUACION ECONOMICA' }
                  ],
                  //alignment: 'center',
                  bold: 'true',
                  margin: 4,
                  fillColor: '#dddddd',
                  colSpan: 5,
                  pageBreak: (lista_familiares.length>4)?'before':''
                }, {}, {}, {}, {}
              ],
              [
                {
                  text: [
                    { text: 'Ingresos mensuales\n', style: 'titulocol' },
                    { text: '$ ' + aspirante.aov_ingresos, style: 'textonormal' }
                  ],
                },
                {
                  text: [
                    { text: 'Otros ingresos\n', style: 'titulocol' },
                    { text: '$ ' + aspirante.aov_ingresos_otros, style: 'textonormal' }
                  ],
                },
                {
                  text: [
                    { text: 'Gastos mensuales\n', style: 'titulocol' },
                    { text: '$ ' + aspirante.aov_gastos, style: 'textonormal' }
                  ],
                },
                {
                  text: [
                    { text: 'Movilizacion al trabajo\n', style: 'titulocol' },
                    { text: aspirante.aov_serv_transporte, style: 'textonormal' }
                  ], colSpan: 2,
                }, {}
              ],
            ]
          }
        }
      ],
      styles: {
        titulo: {
          fontSize: 14,
          bold: true,
          color: '#071F3B',
        },
        subtitulo: {
          fontSize: 12,
          bold: true,
          //background:'#000000'
        },
        titulocol: {
          fontSize: 8.5, // >>>> 9
          //bold: true,
        },
        textonormal: {
          fontSize: 10, // >>>> 11
          bold: true,
        },
        contenido: {
          margin: [0, 10, 0, 15],
        }
      }

    }


    //console.log(fecha, cuerpo);

    return pagina;
  }


  getContacto(strcontacto, index) {
    const contacto = JSON.parse(strcontacto);
    //console.log(strcontacto)
    const item = [
      [
        {
          text: "FAMILIAR #" + index,
          //alignment: 'center',
          bold: 'true',
          margin: 2,
          fillColor: '#f0f0f0',
          height: 150,
          colSpan: 3,
        }, {}, {}
      ],
      [
        {
          text: [
            { text: 'Nombre\n', style: 'titulocol' },
            { text: contacto.nombre.toUpperCase(), style: 'textonormal' }
          ], //colSpan: 3,
        }, //{}, {},
        {
          text: [
            { text: 'Parentezco\n', style: 'titulocol' },
            { text: contacto.parentezco.toUpperCase(), style: 'textonormal' }
          ]
        },
        {
          text: [
            { text: 'Telefono\n', style: 'titulocol' },
            { text: contacto.telefono, style: 'textonormal' }
          ]
        }
      ],
      [
        {
          text: [
            { text: 'Lugar de Domicilio / Vivienda:\n', style: 'titulocol' },
            { text: contacto.direccion.toUpperCase(), style: 'textonormal' },
            { text: '\n\nSitio de referencia:\n', style: 'titulocol' },
            { text: contacto.referencia.toUpperCase(), style: 'textonormal' }
          ],
          //colSpan: 3,
        }, //{}, {},
        {
          text: [
            { text: 'Descripción de la vivienda:\n', style: 'titulocol' },
            { text: contacto.vivienda.toUpperCase(), style: 'textonormal' }
          ],
          colSpan: 2
        }, {}
      ]
    ];

    return item;
  }

  getEdad(fecha) {
    //convert date again to type Date
    if (!fecha) return '';

    const bdate = new Date(fecha);

    const timeDiff = Math.abs(Date.now() - bdate.getTime());
    //alert(`${Math.floor((timeDiff / (1000 * 3600 * 24)) / 365)} años `)
    const edad = `${Math.floor((timeDiff / (1000 * 3600 * 24)) / 365)} años`;
    //return (fecha.slice(0, 10) + ' (' + edad + ')')
    return edad;
    //console.log(this.asp_edad)
  };


  getFamiliares(contactos) {
    //contactos.push(contactos[1]);
    //contactos.pop();

    let pdfrows = []
    contactos.forEach(element => {
      element.nombre = element.apellidos.concat(" ", element.nombres)
      const options: any = { year: 'numeric', month: 'short', day: 'numeric' };
      const fecha = new Date(element.nacimiento).toLocaleString('es-EC', options);
      element.edad = this.getEdad(element.nacimiento);
      element.nacimiento = fecha;
      //alert(JSON.stringify(element))
      const contacto = [
        [
          {
            text: [
              { text: 'Apellidos y nombres\n', style: 'titulocol' },
              { text: element.nombre.toUpperCase(), style: 'textonormal' }
            ], colSpan: 2, fillColor: '#f0f0f0',
          }, {},
          {
            text: [
              { text: 'Fecha nacimiento\n', style: 'titulocol' },
              { text: element.nacimiento, style: 'textonormal' }
            ]
          },
          {
            text: [
              { text: 'Edad\n', style: 'titulocol' },
              { text: element.edad, style: 'textonormal' },
            ],
          },
          {
            text: [
              { text: 'Sexo\n', style: 'titulocol' },
              { text: element.sexo, style: 'textonormal' }
            ]
          },
          {
            text: [
              { text: 'Trabaja\n', style: 'titulocol' },
              { text: (element.trabajando) ? 'SI' : 'NO', style: 'textonormal', alignment: "center" },
            ],
            //colSpan: 3,
          },
        ],
        [
          {
            text: [
              { text: 'Parentezco:\n', style: 'titulocol' },
              { text: element.parentezco, style: 'textonormal' },
            ],
          },
          {},
          (element.estudiando) ? {
            text: [
              { text: 'Estudios (Nivel / Grado)\n', style: 'titulocol' },
              //{ text: 'Nivel: ', style: 'titulocol' },
              { text: element.nivel.toUpperCase() + " / " + element.grado, style: 'textonormal' },
              //{ text: '\tGrado: ', style: 'titulocol' },
              //{ text: element.grado, style: 'textonormal' }
            ],
            //fillColor: '#eeeeee',
            colSpan: 3
          } : {}, {}, {}, {}
        ], [
          {
            text: '',
            margin: 4,
            colSpan: 6,
            border: [false, true, false, false]
          }, {}, {}, {}, {}]
      ];

      pdfrows = [...pdfrows, ...contacto]
    });

    const tabla = {
      widths: [100, 120, 80, 40, 65, '*'],
      border: false,
      body: pdfrows,
      layout: 'noBorders'
    };


    //alert(JSON.stringify(tabla))
    return tabla
  }


}
