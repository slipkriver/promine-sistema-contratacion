import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrincipalThPageRoutingModule } from './principal-th-routing.module';

import { PrincipalThPage } from './principal-th.page';
import { ComponentsModule } from '../../componentes/components.module';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrincipalThPageRoutingModule,
    ComponentsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  declarations: [
    PrincipalThPage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-EC'},
  ]
})
export class PrincipalThPageModule {}