import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrincipalSeguridadPageRoutingModule } from './principal-seguridad-routing.module';

import { PrincipalSeguridadPage } from './principal-seguridad.page';
import { ComponentsModule } from '../../componentes/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrincipalSeguridadPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PrincipalSeguridadPage]
})
export class PrincipalSeguridadPageModule { }
