import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrincipalPsicologiaPage } from './principal-psicologia.page';

const routes: Routes = [
  {
    path: '',
    component: PrincipalPsicologiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrincipalPsicologiaPageRoutingModule {}
