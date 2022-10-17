import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioHomePage } from './inicio-home.page';

const routes: Routes = [
  {
    path: '',
    component: InicioHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioHomePageRoutingModule {}
