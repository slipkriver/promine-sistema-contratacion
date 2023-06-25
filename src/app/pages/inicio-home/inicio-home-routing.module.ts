import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioHomePage } from './inicio-home.page';

const routes: Routes = [
  {
    path: '',
    component: InicioHomePage,
    children: [
      {
        path:'aspirante-new',
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
export class InicioHomePageRoutingModule {}
