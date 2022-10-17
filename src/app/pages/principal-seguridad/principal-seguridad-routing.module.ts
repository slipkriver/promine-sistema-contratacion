import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrincipalSeguridadPage } from './principal-seguridad.page';

const routes: Routes = [
  {
    path: '',
    component: PrincipalSeguridadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrincipalSeguridadPageRoutingModule {}
