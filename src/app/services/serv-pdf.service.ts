import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { DataService } from 'src/app/services/data.service';



@Injectable({
  providedIn: 'root'
})
export class ServPdfService {

  pdfObj = null;
  responsables = [];

  encabezado;

  constructor(
    private dataService: DataService

  ) {

    //LISTAR RESPONSABLES
    /*this.dataService.getResponsables().subscribe(res => {
      this.responsables = res['responsables']
      //console.log(this.responsables)
    })*/

    this.getEncabezado();

  }

  convertResponsable<T>(responsables, aspirante) {

    //console.log(responsables)

    //return new Promise(resolve => {

    const lista = [];

    responsables.forEach(element => {

      switch (element['res_id']) {
        case '1':
          element = { ...element, 'fecha_ingreso': aspirante['f_aprobado_tthh'] }
          break;
        case '2':
          element = { ...element, 'fecha_ingreso': aspirante['f_aprobado_psico'] }
          // console.log('--PSICO')
          break;
        case '3':
          element = { ...element, 'fecha_ingreso': aspirante['f_aprobado_medi'] }
          // console.log('==MEDCI')
          break;
        case '4':
          element = { ...element, 'fecha_ingreso': aspirante['f_aprobado_segu'] }
          // console.log('++SEGU')
          break;
        case '5':
          element = { ...element, 'fecha_ingreso': '*set fecha!!' }
          // console.log('>>TSOCIAL')
          break;

        default:
          break;
      }


      const fila = [
        {
          text: [
            { text: `Departamento de ${element['res_departamento']} \n\n`, style: 'titulocol' },
            // { text: '0994557871', style:'textonormal' }
            { text: `${element['res_titulo']} ${element['res_nombre']}`, style: 'textonormal' },
            { text: `\n\n${element['res_cargo']}`, style: 'titulocol', italics: true }
          ],
          colSpan: 2
        },
        {},
        {
          text: [
            { text: 'Fecha aprobacion \n\n', style: 'titulocol' },
            // { text: '0994557871', style:'textonormal' }
            { text: element['fecha_ingreso'], style: 'textonormal', alignment: 'right' }
          ]
        },
        {
          text: [
            { text: 'Observaciones: \n\n\n', style: 'titulocol' },
            // { text: listaItems[0]['fecha_ingreso'], style: 'textonormal', alignment: 'right' }
            { text: '\n\n\n Sello y firma de aprobacion ', style: 'titulocol', bold: true },
            // { text: '0994557871', style:'textonormal' }
          ],
          colSpan: 2
        }, {}
      ]

      lista.push(JSON.stringify(fila))

    });

    //})
    return (lista);
    //const lista = responsables

  }

  async getEncabezado() {
    this.encabezado = {
      image: await this.getBase64ImageFromURL('assets/icon/membrete.jpg'),
      width: 600,
      //height: 30,
      margin: [0, 10, 0, 0],
      alignment: 'center'
    }
  }

  async getPdfFichaingreso(aspirante?) {

    let salto: any = { text: '', pageBreak: 'after' };

    const contenido = [];

    let listaItems = this.convertResponsable(this.responsables, aspirante)

    //console.log(aspirante)
    //return;

    contenido.push(
      { text: 'FICHA DE INGRESO PERSONAL NUEVO', style: 'titulo', alignment: 'center', margin: [0, 60, 0, 0] },

      { text: 'INFORMACIÓN GENERAL', style: 'subtitulo', margin: [0, 10, 0, 5] },
      {
        table: {
          widths: [100, 100, 80, 100, 80],
          body: [
            //FILA #1
            [
              {
                rowSpan: 4,
                //text: 'FOTO',
                image: await this.getBase64ImageFromURL(aspirante.asp_url_foto.replace('..','https://getssoma.com') || 'assets/icon/no-person.png'),
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
                  { text: aspirante.asp_nombre, style: 'textonormal' }
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
                  { text: 'Sexo\n', style: 'titulocol' },
                  // { text: 'HOMBRE', style:'textonormal' }
                  { text: aspirante.asp_sexo, style: 'textonormal' }
                ]
              },
              {
                text: [
                  { text: 'Edad\n', style: 'titulocol' },
                  // { text: '42 AÑOS', style:'textonormal' }
                  { text: this.getEdad(aspirante.asp_fecha_nacimiento) + ' AÑOS', style: 'textonormal' }
                ]
              },
              {
                text: [
                  { text: 'Estado civil\n', style: 'titulocol' },
                  // { text: 'SOLTERO', style:'textonormal' }
                  { text: aspirante.asp_ecivil, style: 'textonormal' }
                ]
              }
            ],

            //FILA #3
            [
              {},
              {
                text: [
                  { text: 'Aspirante al cargo\n', style: 'titulocol' },
                  // { text: 'OPR MINAS/LOCOMOTORA', style:'textonormal' }
                  { text: aspirante.asp_cargo, style: 'textonormal' }
                ],
                colSpan: 2
              },
              {},
              {
                text: [
                  { text: 'Cod. Sectorial\n', style: 'titulocol' },
                  { text: '0430000000036', style: 'textonormal' }
                  //{ text: aspirante.asp_etnia }
                ],
              },
              {
                text: [
                  { text: 'Sueldo\n', style: 'titulocol' },
                  // { text: '$500.00', style:'textonormal' }
                  { text: '$' + aspirante.asp_sueldo, style: 'textonormal' }
                ],
              }
            ],

            //FILA #4
            [
              {},
              {
                text: [
                  { text: 'Experiencia\n', style: 'titulocol' },
                  // { text: 'SI', alignment: 'center', style:'textonormal' }
                  { text: (aspirante.asp_experiencia == 'SI') ? 'SI' : 'NO', style: 'textonormal' },
                ]
              },
              {
                text: [
                  //{ text: '\n', style: 'titulocol' },
                  { text: aspirante.asp_nmb_experiencia, italics: true, fontSize: 11 },
                ],
                colSpan: 3
              },
              {}
            ],

            //FILA #5
            [
              {
                text: [
                  { text: 'Fecha entrevista\n', style: 'titulocol' },
                  { text: '', style: 'textonormal' }
                  //{ text: vproductores[i].prod_discapacidad }
                ]
              },
              {
                text: [
                  { text: 'Fecha ingreso\n', style: 'titulocol' },
                  { text: aspirante.asp_fch_ingreso.substring(0, 10), style: 'textonormal' }
                  //{ text: vproductores[i].prod_ndiscapacidad }
                ],
              },
              {
                text: [
                  { text: 'Referencia personal\n', style: 'titulocol' },
                  // { text: 'ING. NANCY PASTOR', style:'textonormal' }
                  { text: aspirante.asp_referencia }
                ],
                colSpan: 2
              },
              {},
              {
                text: [
                  { text: 'GRUPO\n', style: 'titulocol' },
                  { text: '', style: 'textonormal' }
                ],
              },
            ],

            //FILA #6
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

            //FILA #7
            [
              {
                text: [
                  { text: 'Tipo sangre\n', style: 'titulocol' },
                  // { text: 'O+', alignment: 'center', style:'textonormal' }
                  { text: aspirante.asp_gpo_sanguineo, style: 'textonormal' }
                ],
              },
              {
                text: [
                  { text: 'Direccion de domicilio\n', style: 'titulocol' },
                  // { text: 'BELLAVISTA - EL GUABO', italics: true, fontSize: 11 }
                  { text: aspirante.asp_direccion, italics: true, fontSize: 11 }
                ],
                colSpan: 3,
                rowSpan: 2,
              },
              {}, {},
              {
                text: [
                  { text: 'Aprobado\n', style: 'titulocol' },
                  // { text: 'SI', alignment: 'center', style:'textonormal' }
                  { text: (aspirante.asp_estado == 'APROBADO') ? 'SI' : 'EN PROCESO', alignment: 'center', style: 'textonormal' }
                ],
              },
            ],

            //FILA #8
            [
              {
                text: [
                  { text: 'Telefono\n', style: 'titulocol' },
                  // { text: '0994557871', style:'textonormal' }
                  { text: aspirante.asp_telefono, style: 'textonormal' }
                ],
              },
              {},
              {}, {}, {}
            ],

            //FILA #9 ESPACIO
            [{
              text: '',
              colSpan: 5
            }],
            //FILA #10
            JSON.parse(listaItems[1]),
            JSON.parse(listaItems[2]),
            JSON.parse(listaItems[3]),
            JSON.parse(listaItems[0]),
            JSON.parse(listaItems[4]),
            //[ JSON.parse(listaItems[0])],
            //[ JSON.parse(listaItems[0])]
          ]
        },


      },
      //salto
    )

    let esquemaDoc = {

      header: this.encabezado,


      content: [

        contenido,


      ],

      styles: {
        titulo: {
          fontSize: 15,
          bold: true,
          color: '#3742b8',
        },
        subtitulo: {
          fontSize: 12,
          bold: true,
          //background:'#000000'
        },
        titulocol: {
          fontSize: 9,
          //bold: true,
        },
        textonormal: {
          fontSize: 11,
          bold: true,
        },
        contenido: {
          margin: [0, 10, 0, 15],
        }
      }
    }

    this.pdfObj = pdfMake.createPdf(esquemaDoc);
    const x = this.pdfObj;

    x.download(`ficha-ingreso-${aspirante.asp_cedula}`)

    setTimeout(() => {

      //const x = pdfMake.createPdf(esquemaDoc).open();

    }, 2000);

  }

  async getPdfFichapsicologia(aspirante?) {

    let salto: any = { text: '', pageBreak: 'after' };

    const contenido = [];

    //let listaItems = this.convertResponsable(this.responsables, aspirante)
    //this.responsables = <any>lista
    let responsable;

    this.responsables.forEach(element => {
      if (element.res_departamento.toLowerCase() == "psicologia"){
        responsable = element;
      }
    });

    //console.log(aspirante)
    //return;

    contenido.push(

      {
        style: 'tableExample',
        margin: [0, 70, 0, 0],
        table: {
          widths: [350, 150],
          body: [
            [
              {
                rowSpan: 2,
                text: 'SISTEMA DE GESTION DE SEGURIDAD Y SALUD EN EL TRABAJO',
                fontSize: 14,
                alignment: 'center',
                margin: [10, 2, 10, 0],
              },
              {
                text: 'Código: SGSST-PPA-001',
                border: [false, true, true, true],
                style: 'columna2'
              }
            ],
            [{},
            {
              text:[ 'Fecha: ' ,aspirante.asp_fch_ingreso.substring(0, 10)]  ,
              border: [false, false, true, true],
              style: 'columna2'
            }],
            [{
              rowSpan: 2,
              text: 'DEPARTAMENTO  DE PSICOLOGIA',
              alignment: 'center',
              bold: true,
              margin: [5, 10, 5, 0],
              fillColor: '#E3980F'
            },
            {
              text: 'Versión: 01',
              border: [false, false, true, true],
              style: 'columna2'
            }],
            ['',
              {
                text: 'Página 1 de 2',
                border: [false, false, true, true],
                italics: true,
                style: 'columna2'
              }]
          ]
        },
        layout: {
          hLineWidth: function (i, node) {
            return (i === 0 || i === node.table.body.length) ? 0.05 : 0.05;
          },
          vLineWidth: function (i, node) {
            return (i === 0 || i === node.table.widths.length) ? 0.1 : 0.1;
          }
        }
      },

      //salto

      {
        style: 'tableExample',
        margin: [0, 20, 0, 0],
        table: {
          widths: [200,150, 150],
          body: [
            [
              {
                colSpan: 2,
                text: 'PROCESO DE SELECCIÓN DE PERSONAL',
                fontSize: 14,
                alignment: 'center',
                margin: [0, 5, 0, 5],
                fillColor: '#E3980F'
              },
              {    },
              {
                text: aspirante.apv_fverificado.substring(0, 10),
                fontSize: 14,
                alignment: 'center',
                margin: [0, 5, 0, 5],
                fillColor: '#E3980F'
              }
            ],
            [
              {
                text: [
                  { text: 'Nombre:\n', style: 'titulocol' },
                  { text: aspirante.asp_nombre, style: 'textonormal' }
                ],
              },
              {
                colSpan: 2,
                text: [
                  { text: 'Cargo: \n', style: 'titulocol' },
                  // { text: 'OPR MINAS/LOCOMOTORA', style:'textonormal' }
                  { text: aspirante.asp_cargo, style: 'textonormal' }
                ],
              },
              {    }
            ],
            [
              {
                text: [
                  { text: 'Ced. Identidad\n', style: 'titulocol' },
                  //{ text: '0123456789-0', style:'textonormal' }
                  { text: aspirante.asp_cedula, style: 'textonormal' }
                ]
              },
              {
                text: [
                  { text: 'Telefono\n', style: 'titulocol' },
                  // { text: '0994557871', style:'textonormal' }
                  { text: aspirante.asp_telefono, style: 'textonormal' }
                ],
              },
              {
                text: [
                  { text: 'Fecha de nacimiento\n', style: 'titulocol' },
                  // { text: '42 AÑOS', style:'textonormal' }
                  { text: aspirante.asp_fecha_nacimiento, style: 'textonormal' }
                ]
              }
            ],
            [
              {
                colSpan: 3,                
                text: [
                  { text: 'Direccion de domicilio\n', style: 'titulocol' },
                  // { text: 'BELLAVISTA - EL GUABO', italics: true, fontSize: 11 }
                  { text: aspirante.asp_direccion, style: 'textonormal' }
                ]                    
              },
              {    },
              {    }
            ],
            [
              {
                colSpan: 2,                
                text: [
                  { text: 'Nivel de estudios: \n', style: 'titulocol' },
                  // { text: 'BELLAVISTA - EL GUABO', italics: true, fontSize: 11 }
                  { text: aspirante.asp_academico, style: 'textonormal' }
                ]                    
              },
              {    },
              {  
                text: [
                  { text: 'Situación Militar definida: \n', style: 'titulocol' },
                  // { text: 'BELLAVISTA - EL GUABO', italics: true, fontSize: 11 }
                  { text: aspirante.asp_militar, style: 'textonormal' }
                ] 
              }
            ]
          ]
        },
        layout: {
          hLineWidth: function (i, node) {
            return (i === 0 || i === node.table.body.length) ? 0.05 : 0.05;
          },
          vLineWidth: function (i, node) {
            return (i === 0 || i === node.table.widths.length) ? 0.1 : 0.1;
          }
        }
      },

      {
        style: 'tableExample',
        margin: [0, 20, 0, 0],
        table: {
          widths: [150,150, 200],
          body: [
            [
              {
                colSpan: 3,
                text: 'Concepto Final (espacio para el entrevistador)',
                fontSize: 14,
                alignment: 'center',
                margin: [0, 5, 0, 5],
                fillColor: '#E3980F'
              },
              {    },
              {    }
            ],
            [
              {
                colSpan: 3,
                margin: [5, 10, 0, 10],
                text: [
                  //{ text: 'Cargo: \n', style: 'titulocol' },
                  // { text: 'OPR MINAS/LOCOMOTORA', style:'textonormal' }
                  { text: aspirante.apv_concepto, italics:true, },
                ],
              },
              {    },
              {    }
            ],
            [
              {
                colSpan: 3,   
                margin: [0, 5, 0, 5],
                text: [
                  { text: 'Aprobación psicológica', bold:true, alignment: 'center', },
                  // { text: 'BELLAVISTA - EL GUABO', italics: true, fontSize: 11 }
                ],
                fillColor: '#E3980F'                    
              },
              {    },
              {    }
            ],
            [
              {
                margin: [0, 5, 0, 5],
                text: [
                  { text: (aspirante.apv_aprobado=="SI")? '( X ) APROBADO': 'APROBADO', fontSize:11, alignment: 'center' },
                  // { text: 'BELLAVISTA - EL GUABO', italics: true, fontSize: 11 }
                ]                    
              },
              {
                margin: [0, 5, 0, 5],
                text: [
                  { text: (aspirante.apv_aprobado=="NO")? '( X ) NO APROBADO': 'NO APROBADO' , fontSize:11, alignment: 'center' },
                  // { text: 'BELLAVISTA - EL GUABO', italics: true, fontSize: 11 }
                ]                    
              },
              {
                margin: [0, 5, 0, 5],
                text: [
                  { text: (aspirante.apv_aprobado=="RESERVA")? '( X ) APROBADO CON RESERVA': 'APROBADO CON RESERVA', fontSize:11, alignment: 'center' },
                  // { text: 'BELLAVISTA - EL GUABO', italics: true, fontSize: 11 }
                ]                    
              },
            ],
            [
              {
                colSpan: 3,
                margin: [5, 10, 0, 10],
                lineHeigth:1.5,
                text: [
                  { text: 'Observaciones: \n', style: 'titulocol' },
                  // { text: 'OPR MINAS/LOCOMOTORA', style:'textonormal' }
                  { text: aspirante.apv_observacion, italics:true, }
                ],
              },
              {    },
              {    }
            ],
          ]
        },
        layout: {
          hLineWidth: function (i, node) {
            return (i === 0 || i === node.table.body.length) ? 0.05 : 0.05;
          },
          vLineWidth: function (i, node) {
            return (i === 0 || i === node.table.widths.length) ? 0.1 : 0.1;
          }
        }
      }

    )

    let esquemaDoc = {

      header: this.encabezado,


      content: [

        contenido,

      ],

      footer: {
        margin: [0, -50, 0, 0],
        alignment: 'center',
        lineHeight: 1.5,
        text: [
          { text: responsable.res_titulo.toUpperCase() + ' ' + responsable.res_nombre.toUpperCase(), fontSize: 12, bold:true },
          // { text: 'OPR MINAS/LOCOMOTORA', style:'textonormal' }
          { text: '\n' + responsable.res_cargo.toUpperCase(), fontSize: 11,}
        ],
      },

      styles: {
        columna2: {
          fontSize: 11,
          margin: [5, 0, 0, 0]
          //color: '#3742b8',
        },
        titulocol: {
          fontSize: 9,
          //bold: true,
        },
        textonormal: {
          fontSize: 11,
          bold: true,
        },
      }
    }

    this.pdfObj = pdfMake.createPdf(esquemaDoc);
    const x = this.pdfObj;

    x.download(`certificado-aptitud-${aspirante.asp_cedula}`)

    setTimeout(() => {

      //const x = pdfMake.createPdf(esquemaDoc).open();

    }, 2000);

  }


  async getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      //img.setAttribute("Access-Control-Allow-Origin", '*');
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/jpeg");
        resolve(dataURL)
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }

  getEdad(fecha) {
    //convert date again to type Date
    const bdate = new Date(fecha);
    const timeDiff = Math.abs(Date.now() - bdate.getTime());
    return Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    //console.log(this.asp_edad)
  }


}
