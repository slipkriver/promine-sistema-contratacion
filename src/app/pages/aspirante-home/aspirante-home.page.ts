import { Component, ViewChild, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
//import { Chart } from 'chart.js';
import { Chart, registerables } from 'chart.js';
import { DataService } from '../../services/data.service';
Chart.register(...registerables);


@Component({
  selector: 'app-aspirante-home',
  templateUrl: './aspirante-home.page.html',
  styleUrls: ['./aspirante-home.page.scss'],
})
export class AspiranteHomePage implements OnInit {

  @ViewChild('pieChart1', { static: true }) pieChartSexo;
  @ViewChild('pieChart2', { static: true }) pieChartArea;
  @ViewChild('barChart1', { static: true }) barChart1;

  view: [number, number] = [700, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  aspirantesSexo;
  aspirantesArea;

  colorScheme = JSON.stringify({
    domain: ["#E3990F", "#3dc2ff", "#818283", "#071F3B", "#FFCC07", "#BFBFBF", "#5260ff"]
  });

  single = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    },
    {
      "name": "UK",
      "value": 6200000
    }
  ];


  bars: any;
  pie: any;
  colorArray: any;

  chartsCreados = false;
  isLoading = true;

  numAspirantes = 0;
  cultivos = [
    {
      cult_producto: "QUINUA",
      cult_rendimiento: "28.00",
      cult_preciouni: "90.00",
      cult_superficie: "10000.00"
    },
    {
      cult_producto: "CEBOLLA",
      cult_rendimiento: "40.00",
      cult_preciouni: "40.00",
      cult_superficie: "20000.00"
    },
    {
      cult_producto: "DURAZNO",
      cult_rendimiento: "32.00",
      cult_preciouni: "65.00",
      cult_superficie: "12000.00"
    },
    {
      cult_producto: "TOMATE",
      cult_rendimiento: "80.00",
      cult_preciouni: "30.00",
      cult_superficie: "25000.00"
    },
    {
      cult_producto: "ZANAHORIA",
      cult_rendimiento: "50.00",
      cult_preciouni: "25.00",
      cult_superficie: "9000.00"
    }
  ]


  constructor(
    private dataService: DataService,
    private platform: Platform
  ) {
    //Object.assign(this, { single });
  }

  ngOnInit() {

    this.dataService.aspirantes$.subscribe(res => {
      //this.submenu = list;
      // console.log(res, this.aspirantesSexo);
      this.initData()
    })

  }


  ionViewDidEnter() {



    //this.platform.ready().then(() => {
    setTimeout(() => {

      // console.log("NO data onInit() ", this.chartsCreados, this.dataService.aspirantes.length, this.aspirantesSexo);
      if (this.chartsCreados === false) {
        this.initData();
      }

    }, 1000);

    //})
  }


  initData() {
    this.aspirantesSexo = this.dataService.getAspirantesSexo()
    this.aspirantesArea = this.dataService.getAspirantesArea();
    this.numAspirantes = this.dataService.aspirantes.length;
    if (this.chartsCreados === false) {
      this.chartsCreados = true
      // console.log(this.aspirantesSexo, this.pie);
      setTimeout(() => {
        this.createCharts()
      }, 1000);
    }
  }

  createCharts() {
    //this.getProductosDet()
    this.createPieSexo(this.pieChartSexo, this.aspirantesSexo);
    this.createPieArea(this.pieChartArea, this.aspirantesArea);
    this.isLoading = false
  }


  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }


  async getProductosDet() {
    //console.log(tarea, '->',text)

    return new Promise(resolve => {

      //this.createBarChart(this.barChart1, 'bar');

      resolve(true);
    })
    // });
  }

  async createBarChart(componente, tipo) {

    let nombres = []
    let superficie = []
    let colorArray = JSON.parse(this.colorScheme)['domain']
    this.cultivos.forEach(cultivo => {
      nombres.push(cultivo['cult_producto'])
      superficie.push((parseFloat(cultivo.cult_superficie) / 10000).toFixed(2))
      //colorArray.push('#' + Math.floor(Math.random() * 16777215).toString(16));
    });

    // console.log(superficie);

    this.bars = new Chart(componente.nativeElement, {
      type: tipo,
      data: {
        labels: nombres,
        datasets: [{
          label: 'Superficie por cultivo (Ha)',
          data: superficie,
          //fill: false,
          backgroundColor: colorArray, // array should have same number of elements as number of dataset
          //borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          //borderWidth: 1,

        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }

        }
      }
    });

  }


  async createPieSexo(componente, sexos) {

    let nombres = ['MASCULINO', 'FEMENINO', 'OTROS']

    function shuffleArray(arr): any {
      return arr.sort(() => Math.random() - 0.2);
    }
    let colorArray = shuffleArray(JSON.parse(this.colorScheme)['domain'])
    //console.log(colorArray, colores)

    const aspirantes = [sexos.hombres, sexos.mujeres, sexos.otros]

    this.pie = new Chart(componente.nativeElement, {
      type: 'pie',
      data: {
        labels: nombres,
        datasets: [{
          label: 'cantidad: ',
          data: aspirantes,
          //fill: false,
          backgroundColor: colorArray, // array should have same number of elements as number of dataset
          //borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          //borderWidth: 1,

        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 10,
                // family: 'vazir'
              }
            }
          },
          tooltip: {
            bodyFont: {
              size: 13,
              family: 'vazir'
            }
          }
        },
        /*scales: {
          x: {
            ticks: {
              font: {
                size: 10,
                family: 'vazir'
              }
            }
          },
          y: {
            ticks: {
              font: {
                size: 10,
                family: 'vazir'
              }
            }
          }
        }*/
      }
    })

    await this.pie
  }

  async createPieArea(componente, areas) {

    let nombres = ['MINA', 'PLANTA', 'ADMINISTRACION']

    function shuffleArray(arr): any {
      return arr.sort(() => Math.random() - 0.5);
    }
    let colorArray = shuffleArray(JSON.parse(this.colorScheme)['domain'])

    const aspirantes = [areas.mina, areas.planta, areas.administracion]
    //console.log(aspirantes)

    this.bars = new Chart(componente.nativeElement, {
      type: 'bar',
      data: {
        labels: nombres,
        datasets: [{
          label: 'AREAS DE TRABAJO',
          data: aspirantes,
          //fill: false,
          backgroundColor: colorArray, // array should have same number of elements as number of dataset
          //borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          //borderWidth: 1,

        }]
      },
      options: {
        responsive: true,
        // scales: {
        //   y: {
        //     beginAtZero: true
        //   }
        // }
      }
    })

    await this.bars
  }


}
