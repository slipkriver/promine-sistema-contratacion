import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AspirantePsicologiaPage } from './aspirante-psicologia.page';

const routes: Routes = [
  {
    path: '',
    component: AspirantePsicologiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AspirantePsicologiaPageRoutingModule {}
