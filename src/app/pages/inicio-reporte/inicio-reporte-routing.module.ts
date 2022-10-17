import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioReportePage } from './inicio-reporte.page';

const routes: Routes = [
  {
    path: '',
    component: InicioReportePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioReportePageRoutingModule {}
