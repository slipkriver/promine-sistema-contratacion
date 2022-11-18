import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AspiranteNewPageRoutingModule } from './aspirante-new-routing.module';

import { AspiranteNewPage } from './aspirante-new.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AspiranteNewPageRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  declarations: [AspiranteNewPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AspiranteNewPageModule {}
