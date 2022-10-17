import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioPage } from './inicio.page';

const routes: Routes = [

  {
    path: '',
    component: InicioPage,
    children: [
      {
        path:'tab-inicio',
        loadChildren: () => import('../../tabs/tab-inicio/tab-inicio.module').then( m => m.TabInicioPageModule )
      },
      {
        path:'tab-aspirante',
        loadChildren: () => import('../../tabs/tab-aspirante/tab-aspirante.module').then( m => m.TabAspirantePageModule )
      },
      {
        path:'devtools',
        loadChildren: () => import('../../pages/devtools/devtools.module').then( m => m.DevtoolsPageModule )
      },
      {
        path: '',
        redirectTo: 'tab-inicio',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioPageRoutingModule {}
