import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrincipalLegalPage } from './principal-legal.page';

const routes: Routes = [
  {
    path: '',
    component: PrincipalLegalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrincipalLegalPageRoutingModule {}
