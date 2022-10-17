import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrincipalThPage } from './principal-th.page';

const routes: Routes = [
  {
    path: '',
    component: PrincipalThPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrincipalThPageRoutingModule {}
