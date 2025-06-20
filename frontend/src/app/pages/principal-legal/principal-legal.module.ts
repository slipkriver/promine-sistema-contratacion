import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrincipalLegalPageRoutingModule } from './principal-legal-routing.module';

import { PrincipalLegalPage } from './principal-legal.page';
import { ComponentsModule } from '../../componentes/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrincipalLegalPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PrincipalLegalPage]
})
export class PrincipalLegalPageModule {}
