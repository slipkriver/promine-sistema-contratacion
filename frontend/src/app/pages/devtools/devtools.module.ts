import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DevtoolsPageRoutingModule } from './devtools-routing.module';

import { DevtoolsPage } from './devtools.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DevtoolsPageRoutingModule
  ],
  declarations: [DevtoolsPage]
})
export class DevtoolsPageModule {}
