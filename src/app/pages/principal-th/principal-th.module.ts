import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrincipalThPageRoutingModule } from './principal-th-routing.module';

import { PrincipalThPage } from './principal-th.page';
import { ComponentsModule } from '../../componentes/components.module';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrincipalThPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [
    PrincipalThPage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
  ]
})
export class PrincipalThPageModule {}