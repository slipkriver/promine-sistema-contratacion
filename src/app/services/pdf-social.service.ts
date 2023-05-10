import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PdfSocialService {

  fecha = new Date()
  fechastr = this.fecha.toISOString().substring(0, 10)

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
          font: 'Times',
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
    // console.log(cuerpo);
    const contacto1 = this.getContacto(aspirante.aov_familiar, 1)
    const contacto2 = this.getContacto(aspirante.aov_responsable, 2)
    
    const pagina =
    {
      content: [
        {
          //colSpan: 2,
          text: 'DATOS DE IDENTIFCACION DEL TRABAJADOR\n',
          fontSize: 14,
          margin:[0,15,0,10],
          bold: true,
          alignment: 'center',
          fillColor: '#FFFFFF',
          style: 'titulocol'
        },
        {
          table: {
            widths: [100, 100, 80, 100, 80],
            body: [
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
                    { text: 'Clave IESS\n', style: 'titulocol' },
                    { text: aspirante.aov_iess_clave, style: 'textonormal' }
                  ],
                  colSpan:2
                },
              ],
    
              //FILA #9
              [
                {
                  text: [
                    { text: 'Cuenta bancaria\n', style: 'titulocol' },
                    { text: '#'+aspirante.aov_banco_cuenta, style: 'textonormal' }
                  ],
                  colSpan:2,
                },
                {},
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
                    { text: 'DATOS DEL CONADIS' }
                  ],
                  alignment: 'center',
                  bold: 'true',
                  margin: 4,
                  fillColor: '#a7a7a7',
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
  
              [
                {
                  text: [
                    { text: 'FAMILIARES DE CONTACTO' }
                  ],
                  alignment: 'center',
                  bold: 'true',
                  margin: 4,
                  fillColor: '#a7a7a7',
                  colSpan: 5,
                },
              ],
              contacto1[0],
              contacto1[1],
              contacto1[2],
              contacto2[0],
              contacto2[1],
              contacto2[2]
    
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
  //alert(JSON.stringify(contactos)+'-'+x)

  const item = [
    [
      {
        text: "FAMILIAR #" + index,
        //alignment: 'center',
        bold: 'true',
        margin: 2,
        fillColor: '#DDDDDD',
        colSpan: 5,
      }, {}, {}, {}, {}
    ],
    [
      {
        text: [
          { text: 'Nombre\n', style: 'titulocol' },
          { text: contacto.nombre.toUpperCase(), style: 'textonormal' }
        ], colSpan: 3,
      }, {}, {},
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
        colSpan: 3,
      }, {}, {},
      {
        text: [
          { text: 'Descripción de la vivienda:\n', style: 'titulocol' },
          { text: contacto.vivienda.toUpperCase(), style: 'textonormal' }
        ],
        colSpan: 2
      }, {}
    ]
  ];
  //alert(JSON.stringify(item[1]))
  return item
}




}
