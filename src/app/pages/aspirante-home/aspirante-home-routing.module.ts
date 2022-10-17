import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AspiranteHomePage } from './aspirante-home.page';

const routes: Routes = [
  {
    path: '',
    component: AspiranteHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AspiranteHomePageRoutingModule {}
