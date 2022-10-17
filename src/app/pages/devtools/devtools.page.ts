import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-devtools',
  templateUrl: './devtools.page.html',
  styleUrls: ['./devtools.page.scss'],
})
export class DevtoolsPage implements OnInit {

  strlista = ""
  cadenaSQL = ""
  cadenaPHP = ""

  listaDefinida = []

  nombretabla = "aspirante"

  cadenaSQLvisible = false
  cadenaPHPvisible = false

  constructor() { }

  ngOnInit() {
  }

  interfaceToLista() {

    var listaArray = this.strlista.split(";")

    this.listaDefinida = []

    listaArray.forEach(atributo => {
      //const item = atributo
      atributo = atributo.split(",")[0]
      atributo = atributo.split(':')[0]
      atributo = atributo.split(',')[0]
      if (atributo.trim().length > 1) {
        let objattrib = { nombre: atributo.trim(), tipo: 'varchar', valor: '16' };
        //atributo['tipo'] = 'varchar'
        this.listaDefinida.push(objattrib)
      }
    })


  }

  setTipoattrib(item, evento) {
    item.tipo = evento.detail.value
    if (item.tipo != "varchar") {
      item.valor = "0"
    }

  }

  setValorattrib(item, tipo) {
    item.valor = tipo.detail.value

  }

  borrarAttrib(item) {
    this.listaDefinida.splice(this.listaDefinida.indexOf(item), 1)
    //delete this.listaDefinida[item]
  }

  interfaceBorrar() {
    this.listaDefinida = []
    this.cadenaSQL = ""
  }

  verStrattrib() {
    if (this.cadenaSQLvisible == true) {
      this.cadenaSQLvisible = false
    } else {
      this.cadenaSQLvisible = true
    }
  }


  interfaceToSQL() {

    var strSQL = "CREATE TABLE " + this.nombretabla + " ( \n "
    var listaSQL = ""
    this.listaDefinida.forEach(atributo => {
      //const item = atributo
      if (atributo.nombre.trim().length > 1) {
        listaSQL = listaSQL + atributo.nombre.trim() + "\t " + atributo.tipo
      }
      if (atributo.tipo == "varchar") {
        listaSQL = listaSQL + "(" + atributo.valor + ")";
        //atributo['tipo'] = 'varchar'
      }
      listaSQL = listaSQL + ",\n"
    })

    listaSQL = listaSQL.trim().substring(0, listaSQL.length - 2)
    listaSQL = strSQL + listaSQL + "\n );"
    this.cadenaSQL = listaSQL
    this.cadenaSQLvisible = true
    //console.log(listaSQL)


  }

  interfaceToPHP(sentencia) {

    var strPHP
    var listaPHP = ""

    if (sentencia == "nuevo") {
      strPHP = "INSERT INTO " + this.nombretabla + " SET \n"
      this.listaDefinida.forEach(atributo => {
        listaPHP = listaPHP + atributo.nombre + " = '$postjson[" + atributo.nombre + "]',\n "
        // listaPHP = listaPHP +"'"+ atributo.nombre + "' => $row['" + atributo.nombre + "'],\n "
      })
    }else if (sentencia == "listar") {
      strPHP = ""
      this.listaDefinida.forEach(atributo => {
        listaPHP = listaPHP + "'" + atributo.nombre + "' => $row['" + atributo.nombre + "'],\n "
        // listaPHP = listaPHP +"'"+ atributo.nombre + "' => $row['" + atributo.nombre + "'],\n "
      })
    }




    listaPHP = listaPHP.trim()
    listaPHP = listaPHP.substring(0, listaPHP.length - 1)
    listaPHP = strPHP + listaPHP
    this.cadenaSQL = listaPHP
    this.cadenaSQLvisible = true
    //console.log(listaPHP)


  }

}
