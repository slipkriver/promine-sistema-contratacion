import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from "pdfmake/build/vfs_fonts";
import { DataService } from 'src/app/services/data.service';
import { PdfSocialService } from './pdf-social.service';

//import {} from '../../assets/fonts/times.ttf'
@Injectable({
  providedIn: 'root'
})
export class ServPdfService {

  pdfObj = null;
  responsables = [];

  encabezado;
  membrete;
  headerpdf;

  fecha = new Date()
  fechastr = this.fecha.toISOString().substring(0, 10)


  constructor(
    private dataService: DataService,
    private pdfSocial: PdfSocialService,

  ) {

    // pdfMake.vfs = pdfFonts.pdfMake.vfs;
    //pdfMake.fonts = this.fonts;
    // pdfMake.vfs = pdfFonts.pdfMake.vfs;
    //pdfMake.fonts = this.fonts;

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = {
      Times: {
        normal: 'times.ttf',
        bold: 'timesbd.ttf',
        italics: 'timesi.ttf',
        bolditalics: 'timesbi.ttf'
      },
      Courier: {
        normal: 'Courier',
        bold: 'Courier-Bold',
        italics: 'Courier-Oblique',
        bolditalics: 'Courier-BoldOblique'
      }
    }

    /*pdfMake.fonts = {
      TimesNewRoman: {
        normal: 'fonts/times.ttf',
        bold: 'timesbd.ttf',
        italics: 'timesi.ttf',
        bolditalics: 'timesbi.ttf'
      }
    };*/

    //LISTAR RESPONSABLES
    this.dataService.getResponsables().subscribe(res => {
      this.responsables = res['responsables']
    })
    //console.log(pdfMake.fonts)

    this.getEncabezado();
    this.getHeaderPdf();

  }

  convertResponsable<T>(responsables) {

    const lista = [];

    responsables.forEach(element => {

      switch (element['res_id']) {
        case '1':
          // element = { ...element, 'fecha_ingreso': aspirante['f_aprobado_tthh'] }
          element = { ...element, 'fecha_ingreso': '' }
          break;
        case '2':
          // element = { ...element, 'fecha_ingreso': aspirante['f_aprobado_psico'] }
          element = { ...element, 'fecha_ingreso': '' }
          // console.log('--PSICO')
          break;
        case '3':
          // element = { ...element, 'fecha_ingreso': aspirante['f_aprobado_medi'] }
          element = { ...element, 'fecha_ingreso': '' }
          // console.log('==MEDCI')
          break;
        case '4':
          // element = { ...element, 'fecha_ingreso': aspirante['f_aprobado_segu'] }
          element = { ...element, 'fecha_ingreso': '' }
          // console.log('++SEGU')
          break;
        case '5':
          // element = { ...element, 'fecha_ingreso': '*set fecha!!' }
          element = { ...element, 'fecha_ingreso': '' }
          // console.log('>>TSOCIAL')
          break;
        case '6':
          // element = { ...element, 'fecha_ingreso': '*set fecha!!' }
          element = { ...element, 'fecha_ingreso': '' }
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
            // { text: element['fecha_ingreso'], style: 'textonormal' }
          ]
        },
        {
          text: [
            { text: 'Observaciones: \n', style: 'titulocol', lineHeight: 3.7 },
            // { text: listaItems[0]['fecha_ingreso'], style: 'textonormal', alignment: 'right' }
            { text: '\n Sello y firma de aprobacion ', fontSize: 9, bold: true },
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

  convertResponsable2<T>(responsables) {

    const lista = [];

    //lista.push( )

    responsables.forEach(element => {

      const fila = [
        {
          text: [
            {},
          ]
        },
        {
          text: [
            { text: `Departamento de ${element['res_departamento']} `, fontSize: 10, alignment: 'center', margin: [0, 10, 0, 0] },
            // { text: '0994557871', style:'textonormal' } 
            {
              text: `\n\n\n\n\n${element['res_titulo']} ${element['res_nombre']}`,
              style: 'textonormal',
              margin: [0, 0, 0, 5],
              alignment: 'center',
              decoration: 'overline',
              decorationStyle: 'dashed',
              decorationColor: '#808080'
            },
            // { text: `\n\n${element['res_cargo']}`, style: 'titulocol', italics: true }
          ],
          colSpan: 2
        },
        {},
        {
          text: [
            { text: `${element['res_temas']}`, style: 'titulocol', alignment: 'center' },
          ],
          colSpan: 2
        }, {}
      ]

      lista.push(JSON.stringify(fila))

    });

    // console.log(lista);
    //const lista = responsables

    return (lista);

  }

  async getEncabezado() {
    this.encabezado = {
      image: await this.getBase64ImageFromURL('assets/icon/membrete.jpg'),
      width: 600,
      //height: 30,
      margin: [0, 10, 0, 50],
      alignment: 'center'
    }
  }

  async getHeaderPdf() {
    this.headerpdf = await this.getBase64ImageFromURL('assets/icon/header-pdf.jpg')
  }

  getHeaderFormal(currentPage, pageCount, { doc_codigo, doc_version, doc_proceso, doc_fecha_aprobado, doc_departamento }) {

    return [{
      margin: [5, 5, 5, 0],
      table: {
        widths: [420, '*'],
        heights: [15, 15, 15, 15, 15],
        body: [
          [
            {
              rowSpan: 3,
              image: this.headerpdf,
              fit: [300, 60],
              alignment: 'center',
              margin: [0, 0, 0, 0]
            },
            { text: 'CODIGO: ' + doc_codigo, fontSize: 11 }
          ],
          ['', { text: 'VERSION: ' + doc_version, fontSize: 11 }],
          ['', { text: 'APROBADO: ' + doc_fecha_aprobado, fontSize: 11 }],
          [
            { text: 'DEPARTAMENTO ' + doc_departamento, alignment: 'center', fillColor: '#FFCC06' },
            { text: `Pagina ${currentPage} de ${pageCount}`, italics: true, fontSize: 11 }
          ],
          [{ text: doc_proceso, alignment: 'center', bold: true, colSpan: 2 }, {}]
        ]
      }

    }]

  }


  getMembrete(aspirante, departamento, documento?, full = true) {

    // console.log(documento);
    const options: any = { year: 'numeric', month: 'long', day: 'numeric' };
    const fecha = new Date(aspirante.amv_femision).toLocaleString('es-EC', options);
    //const options: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    //const fecha = this.fecha.toLocaleString('es-EC', options);

    this.membrete = [{
      style: 'tableExample',
      //margin: [0, 70, 0, 0],
      table: {
        widths: [350, 150],
        body: [
          [
            {
              rowSpan: 2,
              text: 'SISTEMA DE GESTION DE SEGURIDAD Y SALUD EN EL TRABAJO',
              fontSize: 12,
              alignment: 'center',
              margin: [10, 2, 10, 0],
            },
            {
              text: 'Código: ' + (documento?.doc_codigo || 'SGSST-PPA-001'),
              border: [false, true, true, true],
              style: 'columna2'
            }
          ],
          [{},
          {
            text: ['Fecha: ', aspirante.asp_fch_ingreso.substring(0, 10)],
            border: [false, false, true, true],
            style: 'columna2'
          }],
          [{
            rowSpan: 2,
            text: 'DEPARTAMENTO DE ' + departamento.toUpperCase(),
            alignment: 'center',
            bold: true,
            margin: [5, 10, 5, 0],
            fillColor: '#dddddd'
          },
          {
            text: 'Versión: 01',
            border: [false, false, true, true],
            style: 'columna2'
          }],
          ['',
            {
              text: 'Página 1 de 1',
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
    (full) ? {
      style: 'tableExample',
      margin: [0, 20, 0, 0],
      table: {
        widths: [200, 150, 150],
        body: [
          [
            {
              colSpan: 2,
              text: (documento?.doc_titulo || 'PROCESO DE SELECCIÓN DE PERSONAL'),
              fontSize: 12,
              alignment: 'center',
              margin: [0, 5, 0, 5],
              fillColor: '#dddddd',
              bold: true,
            },
            {},
            {
              // text: aspirante.amv_femision.substring(0, 10),
              text: fecha,
              fontSize: 11,
              alignment: 'center',
              margin: [0, 5, 0, 5],
              fillColor: '#dddddd'
            }
          ],
          [
            {
              colSpan: 2,
              text: [
                { text: 'Nombre:\n', style: 'titulocol' },
                { text: aspirante.asp_nombre, style: 'textonormal' }
              ],
            }, {},
            {
              text: [
                { text: 'Ced. Identidad\n', style: 'titulocol' },
                //{ text: '0123456789-0', style:'textonormal' }
                { text: aspirante.asp_cedula, style: 'textonormal' }
              ]
            }
          ],
          [
            {
              text: [
                { text: 'Sexo: \n', style: 'titulocol' },
                // { text: 'BELLAVISTA - EL GUABO', italics: true, fontSize: 10 }
                { text: aspirante.asp_sexo, style: 'textonormal' }
              ]
            },
            {
              text: [
                { text: 'Fecha de nacimiento\n', style: 'titulocol' },
                // { text: '42 AÑOS', style:'textonormal' }
                { text: aspirante.asp_fecha_nacimiento, style: 'textonormal' }
              ]
            },
            {
              text: [
                { text: 'Telefono\n', style: 'titulocol' },
                // { text: '0994557871', style:'textonormal' }
                { text: aspirante.asp_telefono, style: 'textonormal' }
              ],
            },
          ],
          [
            {
              colSpan: 2,
              text: [
                { text: 'Cargo / Puesto de trabajo (CIUO): \n', style: 'titulocol' },
                // { text: 'OPR MINAS/LOCOMOTORA', style:'textonormal' }
                { text: aspirante.asp_cargo, style: 'textonormal' }
              ],
            }, {},
            // {
            //   text: [
            //     { text: 'Nivel de estudios: \n', style: 'titulocol' },
            //     { text: aspirante.asp_academico, style: 'textonormal' }
            //   ]
            // },
            {
              text: [
                { text: 'Evaluacion: \n', style: 'titulocol' },
                { text: aspirante.amv_evaluacion, style: 'textonormal' }
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
    } : {}
      /*[
        {
          colSpan: 3,
          text: [
            { text: 'Direccion de domicilio\n', style: 'titulocol' },
            // { text: 'BELLAVISTA - EL GUABO', italics: true, fontSize: 10 }
            { text: aspirante.asp_direccion, style: 'textonormal' }
          ]
        },
        {},
        {}
      ],
      [
        {
          colSpan: 2,
          text: [
            { text: 'Nivel de estudios: \n', style: 'titulocol' },
            // { text: 'BELLAVISTA - EL GUABO', italics: true, fontSize: 10 }
            { text: aspirante.asp_academico, style: 'textonormal' }
          ]
        },
        {},
        {
          text: [
            { text: 'Situación Militar definida: \n', style: 'titulocol' },
            // { text: 'BELLAVISTA - EL GUABO', italics: true, fontSize: 10 }
            { text: aspirante.asp_militar, style: 'textonormal' }
          ]
        }
      ]*/
    ];

  }


  async getPdfFichaingreso(aspirante?) {

    let salto: any = { text: '', pageBreak: 'after' };

    const contenido = [];
    let listaItems = this.convertResponsable(this.responsables)

    contenido.push(
      { text: 'FICHA DE INGRESO PERSONAL NUEVO', style: 'titulo', alignment: 'center', margin: [0, 65, 0, 5] },

      // { text: 'INFORMACIÓN GENERAL', style: 'subtitulo', margin: [0, 10, 0, 5] },
      {
        table: {
          widths: [100, 100, 80, 100, 80],
          body: [
            //FILA #1
            [
              {
                rowSpan: 4,
                //text: 'FOTO',
                image: await this.getBase64ImageFromURL(aspirante.asp_url_foto.replace('..', 'https://getssoma.com') || 'assets/icon/no-person.png'),
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
                  { text: aspirante.asp_cargo.split(" - ")[0], style: 'textonormal' }
                ],
                colSpan: 2
              },
              {},
              {
                text: [
                  { text: 'Cod. Sectorial\n', style: 'titulocol' },
                  { text: aspirante.asp_codigo, style: 'textonormal' }
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
                  { text: aspirante.asp_nmb_experiencia, italics: true, fontSize: 10 },
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
                  { text: aspirante.asp_ing_entrevista.substring(0, 10) || this.fechastr, style: 'textonormal' }
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
                  { text: aspirante.asp_referencia, style: 'textonormal' }
                ],
                colSpan: 2
              },
              {},
              {
                // text: [
                //   { text: 'GRUPO\n', style: 'titulocol' },
                //   { text: '', style: 'textonormal' }
                // ],
                text: [
                  { text: 'Aprobado\n', style: 'titulocol' },
                  // { text: 'SI', alignment: 'center', style:'textonormal' }
                  { text: (aspirante.asp_estado == 'APROBADO') ? 'SI' : 'EN PROCESO', alignment: 'center', style: 'textonormal' }
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
                  // { text: 'BELLAVISTA - EL GUABO', italics: true, fontSize: 10 }
                  { text: aspirante.asp_direccion, italics: true, fontSize: 10 }
                ],
                colSpan: 3,
                rowSpan: 2,
              },
              {}, {},
              {
                /*text: [
                  { text: 'Aprobado\n', style: 'titulocol' },
                  // { text: 'SI', alignment: 'center', style:'textonormal' }
                  { text: (aspirante.asp_estado == 'APROBADO') ? 'SI' : 'EN PROCESO', alignment: 'center', style: 'textonormal' }
                ],*/
                text: [{ text: 'Huella dactilar\n', style: 'titulocol' },],
                rowSpan: 2,
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
              {}, {}
            ],

            //FILA #9 ESPACIO
            [{
              text: '',
              colSpan: 5,
              background: "#000000"
            }],
            //FILA #10
            JSON.parse(listaItems[0]),
            JSON.parse(listaItems[1]),
            JSON.parse(listaItems[2]),
            JSON.parse(listaItems[3]),
            JSON.parse(listaItems[4]),
            JSON.parse(listaItems[5]),
            //[ JSON.parse(listaItems[0])],
            //[ JSON.parse(listaItems[0])]
          ]
        },


      },
      //salto
    )

    let esquemaDoc = {

      // pageSize: 'A4',

      header: this.encabezado,

      pageMargins: [40, 40, 0, 0],

      content: [

        contenido,

        {
          margin: [-20, 5, 0, -20],
          columns: [
            {
              // auto-sized columns have their widths based on their content
              width: 'auto',
              text: "Habiendo cumplido con todos los requerimientos descritos en el protocolo de ingreso para laborar como trabajador de PROMINE CIA LTDA. y, " +
                "en cumplimiento de lo dispuesto en el Codigo del Trabajo y para todos los efectos previstos en las leyes laborales vigentes, la empresa hace " +
                "la entrega del presente Reglamento Interno del Trabajo, asi; al momento de su ingreso recibira una copia fiel de la original el cual debera ser " +
                "leido en todas sus partes, por lo tanto a partir de la entrega, difusion y revision del mismo, ud como nuevo trabajador de la empresa " +
                "NO podra bajo ninguna excusa alegar el desconocimiento del presente reglamento.",
              fontSize: 8,
              italics: true,
              alignment: 'right'
            },
            {
              width: 150,
              text: '\n\n\n Firma del trabajador',
              fontSize: 10,
              bold: 'true',
              alignment: 'center',
              decoration: 'overline',
              //decorationStyle: 'dashed',
              decorationColor: '#808080'
              // lineHeight: 3
            }
          ],
          // optional space between columns
          //columnGap: 5
        },

        // {
        // },

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

    this.pdfObj = pdfMake.createPdf(esquemaDoc);
    const x = this.pdfObj;

    x.download(`ficha-ingreso-${aspirante.asp_cedula}`)

    setTimeout(() => {
      //const x = pdfMake.createPdf(esquemaDoc).open();
    }, 1000);

  }


  async getPdfRegistroInduccion(aspirante) {

    let salto: any = { text: '', pageBreak: 'after' };

    const contenido = [];

    let listaItems = this.convertResponsable2(this.responsables)

    //console.log(aspirante)
    //return;

    contenido.push(
      { text: 'REGISTRO DE INDUCCION', style: 'titulo', alignment: 'center', margin: [0, 65, 0, 10] },

      // { text: 'INFORMACIÓN GENERAL', style: 'subtitulo', margin: [0, 10, 0, 5] },
      {
        table: {
          widths: [100, 100, 80, 100, 80],
          body: [
            //FILA #1
            [

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
                ],
                colSpan: 2
              },
              {
                text: [
                  { text: 'Edad\n', style: 'titulocol' },
                  // { text: '42 AÑOS', style:'textonormal' }
                  { text: this.getEdad(aspirante.asp_fecha_nacimiento) + ' AÑOS', style: 'textonormal' }
                ]
              },
            ],

            //FILA #2
            [
              {
                text: [
                  { text: 'Aspirante al cargo\n', style: 'titulocol' },
                  // { text: 'OPR MINAS/LOCOMOTORA', style:'textonormal' }
                  { text: aspirante.asp_cargo.split(" - ")[0], style: 'textonormal' }
                ],
                colSpan: 3
              },
              {},
              {},
              {
                text: [
                  { text: 'Departamento\n', style: 'titulocol' },
                  { text: aspirante.asp_cargo.split(" - ")[1], style: 'textonormal' }
                  //{ text: aspirante.asp_etnia }
                ],
              },
              {
                text: [
                  { text: 'Fecha entrevista\n', style: 'titulocol' },
                  { text: aspirante.asp_ing_entrevista.substring(0, 10) || this.fechastr, style: 'textonormal' }
                  //{ text: vproductores[i].prod_discapacidad }
                ]
              },
            ],

            //FILA #9 ESPACIO
            [{
              text: '',
              colSpan: 5,
              background: "#000000"
            }],
            //FILA #10
            [
              { text: 'HORA', style: 'textonormal', alignment: 'center', margin: [0, 5, 0, 5] },
              { text: 'AREA / Responsable', style: 'textonormal', alignment: 'center', colSpan: 2, margin: [0, 5, 0, 5] }, {},
              { text: 'TEMAS', style: 'textonormal', alignment: 'center', colSpan: 2, margin: [0, 5, 0, 5] }, {},
              //{ text: 'FIRMA', style: 'titulocol' }
              //]
            ],

            JSON.parse(listaItems[0]),
            JSON.parse(listaItems[1]),
            JSON.parse(listaItems[2]),
            JSON.parse(listaItems[3]),
            JSON.parse(listaItems[4]),
            JSON.parse(listaItems[5]),
            //[ JSON.parse(listaItems[0])],
            //[ JSON.parse(listaItems[0])]
          ]
        },


      },
      //salto
    )

    let esquemaDoc = {

      // pageSize: 'A4',

      header: this.encabezado,

      pageMargins: [40, 40, 0, 0],

      content: [

        contenido,

        {
          margin: [-20, 5, 0, -20],
          columns: [
            {
              // auto-sized columns have their widths based on their content
              width: 'auto',
              text: " Mediante el presente documento dejo constancia de que se me ha entregado el Reglamento de Higiene y Seguridad; " +
                " y admito haber sido capacitado y entrenado en todos los riesgos a los que estaré expuesto en el área de trabajo que " +
                " desempeñaré mis labores de OPERADOR DE MINAS/CANTERAS  sí, como a acatar y seguir todos los procedimientos y ordenes " +
                " en materia de Seguridad Industrial, Salud Ocupacional y Ambiente. De no ser así la empresa tendrá todo el derecho de presindir de mis servicios.",
              fontSize: 8,
              italics: true,
              alignment: 'right'
            },
            {
              width: 150,
              text: '\n\n\n Firma del trabajador',
              fontSize: 10,
              bold: 'true',
              alignment: 'center',
              decoration: 'overline',
              //decorationStyle: 'dashed',
              decorationColor: '#808080'
              // lineHeight: 3
            }
          ],
          // optional space between columns
          //columnGap: 5
        },

        // {
        // },

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

    x.download(`registro-induccion-${aspirante.asp_cedula}`)

    setTimeout(() => {

      //const x = pdfMake.createPdf(esquemaDoc).open();
    }, 1000);


  }


  async getPdfFichapsicologia(aspirante?) {

    const contenido = [];

    const responsable = this.responsables.find(i => i.res_id === 3);


    contenido.push(
      {
        style: 'tableExample',
        margin: [0, 20, 0, 0],
        table: {
          widths: [150, 150, 200],
          body: [
            [
              {
                colSpan: 3,
                text: 'Concepto Final (espacio para el entrevistador)',
                fontSize: 12,
                alignment: 'center',
                margin: [0, 5, 0, 5],
                fillColor: '#DDDDDD'
              },
              {},
              {}
            ],
            [
              {
                colSpan: 3,
                margin: [5, 10, 0, 10],
                text: [
                  //{ text: 'Cargo: \n', style: 'titulocol' },
                  // { text: 'OPR MINAS/LOCOMOTORA', style:'textonormal' }
                  { text: aspirante.apv_concepto, italics: true, },
                ],
              },
              {},
              {}
            ],
            [
              {
                colSpan: 3,
                margin: [0, 5, 0, 5],
                text: [
                  { text: 'Aprobación psicológica', bold: true, alignment: 'center', },
                  // { text: 'BELLAVISTA - EL GUABO', italics: true, fontSize: 10 }
                ],
                fillColor: '#DDDDDD'
              },
              {},
              {}
            ],
            [
              {
                margin: [0, 5, 0, 5],
                text: [
                  { text: (aspirante.apv_aprobado == "SI") ? '( X ) APROBADO' : 'APROBADO', fontSize: 10, alignment: 'center' },
                  // { text: 'BELLAVISTA - EL GUABO', italics: true, fontSize: 10 }
                ]
              },
              {
                margin: [0, 5, 0, 5],
                text: [
                  { text: (aspirante.apv_aprobado == "NO") ? '( X ) NO APROBADO' : 'NO APROBADO', fontSize: 10, alignment: 'center' },
                  // { text: 'BELLAVISTA - EL GUABO', italics: true, fontSize: 10 }
                ]
              },
              {
                margin: [0, 5, 0, 5],
                text: [
                  { text: (aspirante.apv_aprobado == "RESERVA") ? '( X ) APROBADO CON RESERVA' : 'APROBADO CON RESERVA', fontSize: 10, alignment: 'center' },
                  // { text: 'BELLAVISTA - EL GUABO', italics: true, fontSize: 10 }
                ]
              },
            ],
            [
              {
                colSpan: 3,
                margin: [5, 10, 0, 10],
                lineHeigth: 1.5,
                text: [
                  { text: 'Observaciones: \n', style: 'titulocol' },
                  // { text: 'OPR MINAS/LOCOMOTORA', style:'textonormal' }
                  { text: aspirante.apv_observacion, italics: true, }
                ],
              },
              {},
              {}
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

    this.dataService.getDocumento("PSP-PS-001").subscribe(async res => {

      this.getMembrete(aspirante, "PSICOLOGIA", res['documento'], true);
      await this.membrete;

      contenido.unshift(this.membrete[1]);

      let esquemaDoc = {

        pageSize: 'A4',
        pageMargins: [40, 120, 0, 50],

        header: (currentPage, pageCount) => this.getHeaderFormal(currentPage, pageCount, res['documento']),

        content: contenido,

        footer: {
          margin: [0, -50, 0, 0],
          alignment: 'center',
          lineHeight: 1,
          columns: [
            {
              text: [
                { text: '\n' + responsable.res_titulo.toUpperCase() + ' ' + responsable.res_nombre.toUpperCase(), fontSize: 12, bold: true },
                { text: '\nC.I. ' + responsable.res_cedula, fontSize: 10, },
                { text: '\n' + responsable.res_cargo.toUpperCase(), fontSize: 10, }
              ],
            },
            {
              text: [
                { text: '\n' + aspirante.asp_nombres.split(" ")[0].toUpperCase() + ' ' + aspirante.asp_apellidop.toUpperCase() + ' ' + aspirante.asp_apellidom.toUpperCase(), fontSize: 12, bold: true },
                { text: '\nC.I. ' + aspirante.asp_cedula, fontSize: 10 },
                { text: '\n' + 'TRABAJADOR', fontSize: 10, },
              ],
            }
            // { text: 'OPR MINAS/LOCOMOTORA', style:'textonormal' }
          ],
        },

        styles: {
          columna2: {
            fontSize: 10,
            margin: [5, 0, 0, 0]
            //color: '#3742b8',
          },
          titulocol: {
            fontSize: 9,
            //bold: true,
          },
          textonormal: {
            fontSize: 10,
            bold: true,
          },
        }
      }

      this.pdfObj = pdfMake.createPdf(esquemaDoc);
      const x = this.pdfObj;

      x.download(`certificado-aptitud-${aspirante.asp_cedula}`)

    })


  }


  async getPdfFichamedica(aspirante) {


    const contenido = [];

    const responsable = this.responsables.find(i => i.res_id === 2);


    contenido.push({
      style: 'tableExample',
      margin: [0, 20, 0, 0],
      table: {
        widths: [150, 150, 200],
        body: [
          [
            {
              colSpan: 3,
              text: 'APTITUD MÉDICA LABORAL',
              fontSize: 12,
              alignment: 'center',
              margin: [0, 5, 0, 5],
              fillColor: '#DDDDDD'
            },
            {},
            {}
          ],
          [
            {
              colSpan: 3,
              margin: [0, 5, 0, 2],
              text: [
                //{ text: 'Cargo: \n', style: 'titulocol' },
                // { text: 'OPR MINAS/LOCOMOTORA', style:'textonormal' }
                {
                  text: 'Después de la valoración médica ocupacional se certifica que la persona en mención, es calificada como:',
                  italics: true,
                  fontSize: 10
                },
              ],
            },
            {},
            {}
          ],
          [
            {
              margin: [0, 5, 0, 5],
              text: [
                { text: (aspirante.amv_valoracion == "APTO") ? '( X ) APTO' : 'APTO', fontSize: 10, bold: true, alignment: 'center' },
                // { text: 'BELLAVISTA - EL GUABO', italics: true, fontSize: 10 }
              ]
            },
            {
              margin: [0, 5, 0, 5],
              text: [
                {
                  text: (aspirante.amv_valoracion == "APTO EN OBSERVACION") ? '( X ) APTO OBSERVACION' :
                    (aspirante.amv_valoracion == "APTO CON LIMITACIONES") ? '( X ) APTO LIMITACIONES' : 'APTO OBSERVACION', fontSize: 10, bold: true, alignment: 'center'
                },
                // { text: 'BELLAVISTA - EL GUABO', italics: true, fontSize: 10 }
              ]
            },
            {
              margin: [0, 5, 0, 5],
              text: [
                { text: (aspirante.amv_valoracion == "NO APTO") ? '( X ) NO APTO' : 'NO APTO', fontSize: 10, bold: true, alignment: 'center' },
                // { text: 'BELLAVISTA - EL GUABO', italics: true, fontSize: 10 }
              ]
            },
          ],
          [
            {
              colSpan: 3,
              margin: [5, 5, 0, 5],
              lineHeigth: 1.5,
              text: [
                { text: 'Observaciones: \n', style: 'titulocol' },
                // { text: 'OPR MINAS/LOCOMOTORA', style:'textonormal' }
                { text: aspirante.amv_observacion, italics: true, }
              ],
            },
            {},
            {}
          ],

          [
            {
              colSpan: 3,
              margin: [0, 3, 0, 3],
              text: 'CONDICIONES DE SALUD AL MOMENTO DEL RETIRO',
              fontSize: 12,
              alignment: 'left',
              fillColor: '#DDDDDD'
            },
            {},
            {}
          ],
          [
            {
              colSpan: 2,
              // margin: [0, 5, 0, 5],
              text: [
                { text: "Después de la valoración médica ocupacional se certifica las condiciones de salud al momento del retiro:", fontSize: 10, alignment: 'left' },
                // { text: 'BELLAVISTA - EL GUABO', italics: true, fontSize: 10 }
              ]
            }, {},
            {
              margin: [0, 5, 0, 5],
              text: [
                { text: (aspirante.amv_condicion == "SATISFACTORIO") ? '( X ) SATISFACTORIO' : '( X ) NO SATISFACTORIO', fontSize: 10, alignment: 'center', bold: true },
                // { text: 'BELLAVISTA - EL GUABO', italics: true, fontSize: 10 }
              ]
            },
          ],
          [
            {
              colSpan: 3,
              margin: [0, 5, 0, 0],
              lineHeigth: 1.5,
              text: [
                { text: 'Observaciones al momento del retiro: \n', style: 'titulocol' },
                // { text: 'OPR MINAS/LOCOMOTORA', style:'textonormal' }
                { text: aspirante.amv_observacion2, italics: true, }
              ],
            },
            {},
            {}
          ],

          [
            {
              colSpan: 3,
              margin: [0, 3, 0, 3],
              text: 'RECOMENDACIONES',
              fontSize: 12,
              alignment: 'left',
              fillColor: '#DDDDDD'
            },
            {},
            {}
          ],
          [
            {
              colSpan: 3,
              margin: [5, 0, 0, 5],
              lineHeigth: 1.5,
              text: [
                // { text: 'Observaciones al momento del retiro: \n', style: 'titulocol' },
                // { text: 'OPR MINAS/LOCOMOTORA', style:'textonormal' }
                { text: aspirante.amv_recomendacion, italics: true, }
              ],
            },
            {},
            {}
          ],
          [
            {
              colSpan: 3,
              margin: [0, 5, 0, 5],
              fillColor: '#DDDDDD',
              text: [
                {
                  text: "Con este documento certifico que el trabajador se ha sometido a la evaluación médica requerida para " +
                    "(el ingreso /la ejecución/ el reintegro y retiro) al puesto laboral y se ha informado sobre los riesgos " +
                    "relacionados con el trabajo emitiendo recomendaciones relacionadas con su estado de salud.", fontSize: 10, alignment: 'justify'
                },
                // { text: 'BELLAVISTA - EL GUABO', italics: true, fontSize: 10 }
              ]
            }, {}, {}
          ],
          [
            {
              colSpan: 3,
              // margin: [0, 5, 0, 5],
              text: [
                { text: `La presente certificación se expide con base en la historia ocupacional del usuario (a), la cual tiene carácter de confidencial.`, fontSize: 10, alignment: 'left', italics: true },
                // { text: 'BELLAVISTA - EL GUABO', italics: true, fontSize: 10 }
              ]
            }, {}, {}
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

    this.dataService.getDocumento("PSP-ME-001").subscribe(async res => {

      //console.log(res['documento'], responsable);
      this.getMembrete(aspirante, "MEDICINA", res['documento'], true);
      await this.membrete;

      contenido.unshift(this.membrete[1]);

      let esquemaDoc = {

        pageSize: 'A4',
        pageMargins: [40, 120, 0, 50],

        header: (currentPage, pageCount) => this.getHeaderFormal(currentPage, pageCount, res['documento']),

        content: contenido,

        footer: {
          margin: [0, -50, 0, 0],
          alignment: 'center',
          lineHeight: 1,
          columns: [
            {
              text: [
                { text: '\n' + responsable.res_titulo.toUpperCase() + ' ' + responsable.res_nombre.toUpperCase(), fontSize: 12, bold: true },
                { text: '\nC.I. ' + responsable.res_cedula, fontSize: 10, },
                { text: '\n' + responsable.res_cargo.toUpperCase(), fontSize: 10, }
              ],
            },
            {
              text: [
                { text: '\n' + aspirante.asp_nombres.split(" ")[0].toUpperCase() + ' ' + aspirante.asp_apellidop.toUpperCase() + ' ' + aspirante.asp_apellidom.toUpperCase(), fontSize: 12, bold: true },
                { text: '\nC.I. ' + aspirante.asp_cedula, fontSize: 10 },
                { text: '\n' + 'TRABAJADOR', fontSize: 10, },
              ],
            }
            // { text: 'OPR MINAS/LOCOMOTORA', style:'textonormal' }
          ],
        },

        styles: {
          columna2: {
            fontSize: 10,
            margin: [5, 0, 0, 0]
            //color: '#3742b8',
          },
          titulocol: {
            fontSize: 9,
            //bold: true,
          },
          textonormal: {
            fontSize: 10,
            bold: true,
          },
        }

      }

      this.pdfObj = pdfMake.createPdf(esquemaDoc);
      const x = this.pdfObj;

      x.download(`certificado-salud-${aspirante.asp_cedula}`)


    })


  }


  async getReglamentoInterno(aspirante) {

    let responsable;

    this.responsables.forEach(element => {
      if (element.res_id == 1) {
        responsable = element;
      }
    });

    let esquemaDoc = {

      pageMargins: [20, 100, 0, 30],

      header: (currentPage, pageCount) => {
        return [{
          margin: [5, 5, 5, 0],
          table: {
            widths: [420, '*'],
            heights: [15, 15, 15, 15],
            body: [
              [
                {
                  rowSpan: 3,
                  image: this.headerpdf,
                  fit: [300, 60],
                  alignment: 'center',
                  margin: [0, 0, 0, 0]
                },
                { text: 'CÓDIGO: TTHH–SEL-07', fontSize: 11 }
              ],
              ['', { text: 'VERSIÓN: 1.1', fontSize: 11 }],
              ['', { text: 'APROBADO: 2021', fontSize: 11 }],
              [{ text: 'REGISTRO ENTREGA DE REGLAMENTO DE INTERNO DE TRABAJO', alignment: 'center', bold: true, fillColor: '#FFCC06' },
              { text: `PAG. ${currentPage} de ${pageCount}`, italics: true, fontSize: 11 }]
            ]
          }

        }]
      },

      content: [

        {
          fontSize: 11,
          text: [
            { text: '\n', fontSize: 5 },
            { text: 'OBJETIVO:  ', bold: true },
            { text: 'CUMPLIR CON LA SOCIALIZACIÓN Y ENTREGA DE REGLAMENTO INTERNO DE TRABAJO.\n', italics: true },
            { text: '\n', fontSize: 5 },
            { text: 'ALCANCE:   ', fontSize: 11, bold: true },
            { text: 'TODO EL PERSONAL DE LA MINA', italics: true }
          ]
        },

        {
          margin: [10, 20, 20, 0],
          table: {
            widths: [125, 125, 125, 125],
            fontSize: 11,
            body: [
              [
                {
                  text: [
                    { text: 'Evento\n', style: 'titulocol' },
                    { text: 'CAPACITACION Y ENTREGA DE REGLAMENTO INTERNO DE TRABAJO', style: 'textonormal' }
                  ],
                  colSpan: 3,
                }, '', '',
                {
                  text: [
                    { text: 'Fecha\n', style: 'titulocol' },
                    { text: aspirante.asp_ing_entrevista.substring(0, 10) || this.fechastr, style: 'textonormal' }
                  ]
                }
              ],
              [
                {
                  text: [
                    { text: 'Ced. Identidad\n', style: 'titulocol' },
                    { text: aspirante.asp_cedula, style: 'textonormal' }
                  ]
                },
                {
                  text: [
                    { text: 'Nombre\n', style: 'titulocol' },
                    { text: aspirante.asp_nombre, style: 'textonormal' }
                  ],
                  colSpan: 3
                }, '', '',
              ],
              [
                {
                  text: [
                    { text: 'Aspirante al cargo\n', style: 'titulocol' },
                    { text: aspirante.asp_cargo.split(" - ")[0], style: 'textonormal' }
                  ],
                  colSpan: 3
                }, '', '',
                {
                  text: [
                    { text: 'Area\n', style: 'titulocol' },
                    { text: aspirante.asp_cargo.split(" - ")[1], style: 'textonormal' }
                    //{ text: aspirante.asp_etnia }
                  ],
                }
              ],
              [
                {
                  // for numbered lists set the ol key
                  ol: [
                    `TITULO I:    DISPOSICIONES FUNDAMENTALES 
                     CAPITULO I: CAMPO DE ACCIÓN DEL REGLAMENTO INTERNO.
                     CAPITULO II: DE LOS ÓRGANOS DE ADMINISTRACIÓN DE LA EMPRESA. \n\n`,

                    `TITULO II:   DE LOS CONTRATOS DE TRABAJO
                     CAPITULO I: DE SU FORMAS CONDICIONES Y EFECTOS.
                     CAPITULO II: DE LA SELECCIÓN Y CONTRATACIÓN DE TRABAJADORES.
                     CAPITULO III: DETERMINACIÓN DE LABORES DE CADA TRABAJADOR.
                     CAPITULO IV: JORNADAS Y HORARIOS DE LABORES.
                     CAPITULO V: DE LA PUNTUALIDAD, REGISTRO Y CONTROL DE ASISTENCIA.
                     CAPITULO VI: DE LAS FUNCIONES DE CONFIANZA. \n\n`,

                    `TITULO III:  REMUNERACIONES.
                     CAPITULO I: PAGO DE REMUNERACIONES. \n\n`,

                    `TITULO IV:   DE LA FALTA AL TRABAJO Y PERMISOS
                     CAPITULO I: AUSENCIA, ABANDONO Y TIEMPO DE DURACIÓN DEL PERMISO. \n\n`,

                    `TITULO V:    DE LAS LICENCIAS Y VACACIONES.
                     CAPITULO I: LICENCIAS SIN SUELDO Y CON SUELDOS.
                     CAPITULO II: VACACIONES ANUALES. \n\n`,

                    `TITULO VI:  LUGAR DE TRABAJO LIBRE DE ACOSO
                     CAPITULO I: DEL ACOSO AL TRABAJO DEL COMPORTAMIENTO DEL TRABAJADOR Y DEL ACOSO SEXUAL. \n\n`,

                    `TITULO VII: POLÍTICA DE DROGAS ALCOHOL Y TRABAJO.
                     CAPITULO I: PROHIBICIÓN AL CONSUMO DE DROGAS, ALCOHOL Y TABACO. \n\n`,

                    `TITULO VIII: DEL USO DE LOS IMPLEMENTOS Y BIENES DE LA EMPRESA.
                     CAPITULO I: USO DE IMPLEMENTOS DE OFICINAS, BIENES MUEBLES E INMUEBLES DE LA EMPRESA.
                     CAPITULO II: GASTOS DE VIAJE, ALOJAMIENTO Y ALIMENTACIÓN. \n\n`,

                    `TITULO IX:   DE LAS OBLIGACIONES Y PROHIBICIONES DE LOS TRABAJADORES.
                     CAPITULO I: DE LAS OBLIGACIONES DE LOS TRABAJADORES.
                     CAPITULO II: DE LAS PROHIBICIONES DE LOS TRABAJADORES. \n\n`,

                    `TITULO X:   DEL TRABAJADOR.
                     CAPITULO I: FUNDICIONES, ATRIBUCIONES Y OBLIGACIONES. \n\n`,

                    `TITULO XI:   OBLIGACIONES DE LA EMPRESA.
                     CAPITULO I: OBLIGACIONES. \n\n`,

                    `TITULO XII:  SALUD OCUPACIONAL.
                     CAPITULO I: SALUD. \n\n`,

                    `TITULO XIII: FALTAS DISCIPLINARIAS, SANCIONES Y TERMINACIÓN DEL CONTRATO LABORAL.
                     CAPITULO I: FALTAS DISCIPLINARIAS.
                     CAPITULO II: SANCIONES POR FALTA DISCIPLINARIA. \n\n`,

                    `TITULO XIV:  RECLAMOS Y CONSULTAS
                     CAPITULO I: DE LOS RECLAMOS.
                     CAPITULO II: DE LAS CONSULTAS. \n\n`,

                    `DISPOSICIONES GENERALES. \n`,

                  ],
                  colSpan: 4,
                  margin: [20, 20, 0, 10]
                }, '', '', ''
              ]
            ]
          }
        },

        {
          alignment: 'center',
          lineHeight: 1.5,
          margin: [-20, 320, 0, 0],

          columns: [
            {
              text: [
                { text: '\n' + responsable.res_titulo.toUpperCase() + ' ' + responsable.res_nombre.toUpperCase(), fontSize: 12, bold: true },
                { text: '\nC.I. ' + responsable.res_cedula, fontSize: 10, },
                { text: '\n' + responsable.res_cargo.toUpperCase(), fontSize: 10, }
              ],
            },
            {
              text: [
                { text: '\n' + aspirante.asp_nombres.split(" ")[0].toUpperCase() + ' ' + aspirante.asp_apellidop.toUpperCase() + ' ' + aspirante.asp_apellidom.toUpperCase(), fontSize: 12, bold: true },
                { text: '\nC.I. ' + aspirante.asp_cedula, fontSize: 10 },
                { text: '\n' + 'TRABAJADOR', fontSize: 10, },
              ],
            }
            // { text: 'OPR MINAS/LOCOMOTORA', style:'textonormal' }
          ],
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
          fontSize: 9,
          bold: true,
        },
        textonormal: {
          fontSize: 11,
          //bold: true,
        }
      }

    }

    this.pdfObj = pdfMake.createPdf(esquemaDoc)
    const x = this.pdfObj;

    await x.download(`entrega_reglamento-${aspirante.asp_cedula}`)

  }

  socialDecimosPdf(aspirante) {
    //PdfSocialService

    this.dataService.getDocumento("PSP-TS-001").subscribe(res => {

      const contenido = this.pdfSocial.cuerpoDecimos(aspirante, res['documento'])
      // console.log(contenido);

      let esquemaDoc = {

        pageSize: 'A4',
        pageMargins: [50, 100, 40, 0],

        header: this.encabezado,


        content: [
          contenido.content,
        ],
        styles: {
          header: {
            fontSize: 16,
            bold: true
          },
          subheader: {
            bold: true,
          },
          interline: {
            fontSize: 12,
            lineHeight: 1.5
          }
        }
      }


      this.pdfObj = pdfMake.createPdf(esquemaDoc);
      const x = this.pdfObj;

      x.download(`acumulacion-decimos-${aspirante.asp_cedula}`)

    })
  }


  socialPrevencionPdf(aspirante) {

    this.dataService.getDocumento("PSP-TS-002").subscribe(async res => {

      const contenido = this.pdfSocial.cuerpoPrevencion(aspirante, res['documento'])
      //console.log(pdfMake);

      //pdfMake.vfs = pdfFonts.pdfMake.vfs;
      //pdfMake.fonts = this.fonts;
      //let pdfObj = new pdfMake;

      let docDefinition = {

        pageSize: 'A4',
        pageMargins: [50, 100, 40, 0],

        header: this.encabezado,


        content: contenido.content,

        defaultStyle: {
          //font: 'Times',
        },

        // fonts: this.fonts,

        styles: {
          header: {
            fontSize: 16,
            bold: true
          },
          subheader: {
            bold: true
          },
          interline: {
            fontSize: 12,
            lineHeight: 1.5
          }
        }

      };


      //this.pdfObj = pdfMake.createPdf(esquemaDoc);
      const x = await pdfMake.createPdf(docDefinition).download(`autorizacion-prevencion-${aspirante.asp_cedula}`)
      //console.log(x, docDefinition);


    })
  }

  async socialFichaPdf(aspirante) {
    //PdfSocialService

    //console.log( JSON.parse(aspirante.aov_familiar));

    this.dataService.getDocumento("PSP-TS-004").subscribe(async res => {

      //this.getMembrete(aspirante, "TRABAJO SOCIAL", res['documento'], false);
      //await 
      //await this.membrete;
      const fotografia = await this.getBase64ImageFromURL(aspirante.asp_url_foto.replace('..', 'https://getssoma.com') || 'assets/icon/no-person.png');
      const contenido = this.pdfSocial.cuerpoFicha(aspirante, fotografia)
      const responsable = this.responsables.find(i => i.res_id === 6);
      //console.log(responsable);
      //contenido.push()
      let esquemaDoc = {

        pageSize: 'A4',
        // pageMargins: [50, 50, 40, 0],
        pageMargins: [40, 120, 0, 50],


        header: (currentPage, pageCount) => this.getHeaderFormal(currentPage, pageCount, res['documento']),

        content: [
          //this.membrete,
          contenido.content,

        ],

        footer: (currentPage, pageCount) => {
          //console.log(currentPage, pageCount);

          if (currentPage === pageCount) {
            return [{
              alignment: 'center',
              //lineHeight: 1.5,
              margin: [50, -30, 0, 0],

              columns: [
                {
                  text: [
                    { text: 'Firma y sello\n', style: 'titulocol', color: '#323232' },
                    { text: responsable.res_titulo.toUpperCase() + ' ' + responsable.res_nombre.toUpperCase(), fontSize: 12, bold: true },
                    { text: ' \n', fontSize: 10, },
                    { text: '\n' + responsable.res_cargo.toUpperCase(), fontSize: 10, }
                  ],
                },
                {
                  text: [
                    { text: 'Firma y huella\n', style: 'titulocol', color: '#323232' },
                    { text: aspirante.asp_nombres.split(" ")[0].toUpperCase() + ' ' + aspirante.asp_apellidop.toUpperCase() + ' ' + aspirante.asp_apellidom.toUpperCase(), fontSize: 12, bold: true },
                    { text: '\nC.I. ' + aspirante.asp_cedula, fontSize: 10 },
                    { text: '\n' + 'TRABAJADOR', fontSize: 10, },
                  ],
                }
                // { text: 'OPR MINAS/LOCOMOTORA', style:'textonormal' }
              ],
            }
            ];
          } else return []
        },

        styles: contenido.styles,

      }

      //console.log(esquemaDoc);

      this.pdfObj = pdfMake.createPdf(esquemaDoc);
      const x = this.pdfObj;

      x.download(`ficha-social-${aspirante.asp_cedula}`)

    })
  }

  socialDepositosPdf(aspirante) {
    //PdfSocialService

    this.dataService.getDocumento("PSP-TS-003").subscribe(res => {

      const contenido = this.pdfSocial.cuerpoDepositos(aspirante, res['documento'])
      // console.log(contenido);

      let esquemaDoc = {

        pageSize: 'A4',
        pageMargins: [50, 100, 40, 0],

        header: this.encabezado,


        content: [
          contenido.content,
        ],
        styles: {
          header: {
            fontSize: 16,
            bold: true
          },
          subheader: {
            bold: true,
          },
          interline: {
            fontSize: 12,
            lineHeight: 1.5
          }
        }
      }


      this.pdfObj = pdfMake.createPdf(esquemaDoc);
      const x = this.pdfObj;

      x.download(`solicitud-depositos-${aspirante.asp_cedula}`)

    })
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
