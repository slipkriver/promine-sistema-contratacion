import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrincipalThPageRoutingModule } from './principal-th-routing.module';

import { PrincipalThPage } from './principal-th.page';
import { ComponentsModule } from '../../componentes/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrincipalThPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PrincipalThPage]
})
export class PrincipalThPageModule {}
