import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabInicioPage } from './tab-inicio.page';

const routes: Routes = [
  
  {
    path: '',
    component: TabInicioPage,
    children: [
      {
        path:'inicio-home',
        loadChildren: () => import('../../pages/inicio-home/inicio-home.module').then( m => m.InicioHomePageModule )
      },
      {
        path:'inicio-reporte',
        loadChildren: () => import('../../pages/inicio-reporte/inicio-reporte.module').then( m => m.InicioReportePageModule )
      },
      {
        path: '',
        redirectTo: 'inicio-home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabInicioPageRoutingModule {}
