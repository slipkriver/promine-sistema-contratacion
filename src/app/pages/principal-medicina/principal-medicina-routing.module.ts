import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrincipalMedicinaPage } from './principal-medicina.page';

const routes: Routes = [
  {
    path: '',
    component: PrincipalMedicinaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrincipalMedicinaPageRoutingModule {}
