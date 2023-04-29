import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PdfSocialService {

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


  cuerpoFicha(aspirante) {

    const options: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const fecha = new Date().toLocaleString('es-EC', options);

    let cuerpo = JSON.stringify(aspirante)
    // console.log(cuerpo);

    const pagina =
    {
      content: [
        {
          style: "interline",
          alignment: "justify",
          text: [
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



}
