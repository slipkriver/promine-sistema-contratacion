import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio-reporte',
  templateUrl: './inicio-reporte.page.html',
  styleUrls: ['./inicio-reporte.page.scss'],
})
export class InicioReportePage implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('**report')
  }

}
