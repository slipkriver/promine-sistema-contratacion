import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AspiranteNewPageRoutingModule } from './aspirante-new-routing.module';

import { AspiranteNewPage } from './aspirante-new.page';
// import { } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AspiranteNewPageRoutingModule,
    MatDatepickerModule,
    // MatNativeDateModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule
  ],
  declarations: [AspiranteNewPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-EC' },
    DatePipe
  ]
})

export class AspiranteNewPageModule { }