import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  { path: "", loadChildren: "./pages/menu/menu.module#MenuPageModule", canActivate: [AuthGuard] },
  { path: "login", loadChildren: "./pages/login/login.module#LoginPageModule", canActivate: [LoginGuard] },
  {
    path: 'add-sessao',
    loadChildren: () => import('./pages/add-sessao/add-sessao.module').then( m => m.AddSessaoPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
