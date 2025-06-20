import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioReportePageRoutingModule } from './inicio-reporte-routing.module';

import { InicioReportePage } from './inicio-reporte.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioReportePageRoutingModule
  ],
  declarations: [InicioReportePage]
})
export class InicioReportePageModule {}
