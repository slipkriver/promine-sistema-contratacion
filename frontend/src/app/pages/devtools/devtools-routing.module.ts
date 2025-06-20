import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevtoolsPage } from './devtools.page';

const routes: Routes = [
  {
    path: '',
    component: DevtoolsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevtoolsPageRoutingModule {}
