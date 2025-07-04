import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormValidarMediComponent } from './form-validar-medi/form-validar-medi.component';
import { FormValidarPsicoComponent } from './form-validar-psico/form-validar-psico.component';
import { FormValidarLegalComponent } from './form-validar-legal/form-validar-legal.component';
import { FormValidarSeguComponent } from './form-validar-segu/form-validar-segu.component';
import { FormValidarSocialComponent } from './form-validar-social/form-validar-social.component';
import { HeaderSubmenuComponent } from './header-submenu/header-submenu.component';
import { BuscarAspiranteComponent } from './buscar-aspirante/buscar-aspirante.component';
import { ItemAspiranteComponent } from './item-aspirante/item-aspirante.component';
import { LoadingAspiranteComponent } from './loading-aspirante/loading-aspirante.component';
import { FormValidarTthhComponent } from './form-validar-tthh/form-validar-tthh.component';
import { PopoverInfoComponent } from './popover-info/popover-info.component';
import { ListObservacionComponent } from './list-observacion/list-observacion.component';
import { ListCargosComponent } from './list-cargos/list-cargos.component';
import { FileFormdataComponent } from './file-formdata/file-formdata.component';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatCommonModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
//import { MatTimepickerModule } from '@angular/material/datepicker';
// import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular/material/core';

import { FormPrincipalComponent } from './form-principal/form-principal.component';
// import { MatNativeDateModule } from '@angular/material/core';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormApiPersonaComponent } from './form-api-persona/form-api-persona.component';

@NgModule({
  declarations: [
    HeaderSubmenuComponent,
    BuscarAspiranteComponent,
    ItemAspiranteComponent,
    LoadingAspiranteComponent,
    PopoverInfoComponent,
    ListObservacionComponent,
    ListCargosComponent,
    FileFormdataComponent,
    FormValidarTthhComponent,
    FormValidarMediComponent,
    FormValidarPsicoComponent,
    FormValidarLegalComponent,
    FormValidarSeguComponent,
    FormValidarSocialComponent,
    FormPrincipalComponent,
    FormApiPersonaComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatCommonModule,
    MatTooltipModule,
    MatIconModule,
    MatInputModule,
    // MatNativeDateModule,
    MatDatepickerModule
  ],
  exports: [
    HeaderSubmenuComponent,
    BuscarAspiranteComponent,
    // ItemAspiranteComponent,
    // LoadingAspiranteComponent,
    PopoverInfoComponent,
    // ListObservacionComponent,
    ListCargosComponent,
    // FileFormdataComponent,
    FormPrincipalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }
