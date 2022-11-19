import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AspiranteNewPageRoutingModule } from './aspirante-new-routing.module';

import { AspiranteNewPage } from './aspirante-new.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';



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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-EC'},
  ]
})

export class AspiranteNewPageModule {}
