import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrincipalThPageRoutingModule } from './principal-th-routing.module';

import { PrincipalThPage } from './principal-th.page';
// import { ComponentsModule } from 'src/app/componentes/components.module';
import { ComponentsModule } from '../../componentes/components.module';

// import { MatTooltipModule } from '@angular/material/tooltip';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PrincipalThPageRoutingModule
    // MatTooltipModule
  ],
  declarations: [PrincipalThPage]
})
export class PrincipalThPageModule {}