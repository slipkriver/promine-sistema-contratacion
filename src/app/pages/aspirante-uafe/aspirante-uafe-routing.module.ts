import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AspiranteUafePage } from './aspirante-uafe.page';

const routes: Routes = [
  {
    path: '',
    component: AspiranteUafePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AspiranteUafePageRoutingModule {}
