import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrincipalMedicinaPageRoutingModule } from './principal-medicina-routing.module';

import { PrincipalMedicinaPage } from './principal-medicina.page';

import { ComponentsModule } from '../../componentes/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrincipalMedicinaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PrincipalMedicinaPage],
  entryComponents: [],
})
export class PrincipalMedicinaPageModule {}
