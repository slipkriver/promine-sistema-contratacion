import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AspiranteSeguridadPage } from './aspirante-seguridad.page';

const routes: Routes = [
  {
    path: '',
    component: AspiranteSeguridadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AspiranteSeguridadPageRoutingModule {}
