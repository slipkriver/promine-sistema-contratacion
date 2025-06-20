import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrincipalPsicologiaPageRoutingModule } from './principal-psicologia-routing.module';

import { PrincipalPsicologiaPage } from './principal-psicologia.page';

import { ComponentsModule } from '../../componentes/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PrincipalPsicologiaPageRoutingModule
  ],
  declarations: [PrincipalPsicologiaPage]
})
export class PrincipalPsicologiaPageModule {}
