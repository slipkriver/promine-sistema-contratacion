import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['inicio']);

const routes: Routes = 
[ {
  path: '',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then(m => m.InicioPageModule),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'tab-inicio',
    loadChildren: () => import('./tabs/tab-inicio/tab-inicio.module').then(m => m.TabInicioPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'principal-th',
    loadChildren: () => import('./pages/principal-th/principal-th.module').then( m => m.PrincipalThPageModule)
  },
  {
    path: 'principal-psicologia',
    loadChildren: () => import('./pages/principal-psicologia/principal-psicologia.module').then( m => m.PrincipalPsicologiaPageModule)
  },
  {
    path: 'principal-medicina',
    loadChildren: () => import('./pages/principal-medicina/principal-medicina.module').then( m => m.PrincipalMedicinaPageModule)
  },
  {
    path: 'principal-social',
    loadChildren: () => import('./pages/principal-social/principal-social.module').then( m => m.PrincipalSocialPageModule)
  },
  {
    path: 'principal-seguridad',
    loadChildren: () => import('./pages/principal-seguridad/principal-seguridad.module').then( m => m.PrincipalSeguridadPageModule)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  }
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
