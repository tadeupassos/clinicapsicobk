import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: 'menu',
    component: MenuPage,
    children: [
      {
        path: 'pacientes',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pacientes/pacientes.module').then(m => m.PacientesPageModule)
          }
        ]
      },
      {
        path: 'convenios',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../convenios/convenios.module').then(m => m.ConveniosPageModule)
          }
        ]
      },
      {
        path: 'guias/:parametro/:dados',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../guias/guias.module').then(m => m.GuiasPageModule)
          }
        ]
      },
      {
        path: 'psicologos',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../psicologos/psicologos.module').then(m => m.PsicologosPageModule)
          }
        ]
      },
      {
        path: 'cadpaciente',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../cadpaciente/cadpaciente.module').then(m => m.CadpacientePageModule)
          }
        ]
      },
      {
        path: 'cadpaciente/:id',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../cadpaciente/cadpaciente.module').then(m => m.CadpacientePageModule)
          }
        ]
      },
      {
        path: 'cadconvenio',
        children: [
          {
            path: '',
            loadChildren: () => import('../cadconvenio/cadconvenio.module').then( m => m.CadconvenioPageModule)
          }
        ]
      },
      {
        path: 'cadconvenio/:id',
        children: [
          {
            path: '',
            loadChildren: () => import('../cadconvenio/cadconvenio.module').then( m => m.CadconvenioPageModule)
          }
        ]
      },
      {
        path: 'cadpsicologo',
        children: [
          {
            path: '',
            loadChildren: () => import('../cadpsicologo/cadpsicologo.module').then( m => m.CadpsicologoPageModule)
          }
        ]
      },
      {
        path: 'cadpsicologo/:id',
        children: [
          {
            path: '',
            loadChildren: () => import('../cadpsicologo/cadpsicologo.module').then( m => m.CadpsicologoPageModule)
          }
        ]
      },
      {
        path: 'prontuario/:idPaciente',
        children: [
          {
            path: '',
            loadChildren: () => import('../prontuario/prontuario.module').then( m => m.ProntuarioPageModule)
          }
        ]
      },
      {
        path: 'sessoes/:idPaciente',
        children: [
          {
            path: '',
            loadChildren: () => import('../sessoes/sessoes.module').then( m => m.SessoesPageModule)
          }
        ]
      },
      {
        path: 'cadsessao/:parametro/:id',
        children: [
          {
            path: '',
            loadChildren: () => import('../cadsessao/cadsessao.module').then( m => m.CadsessaoPageModule)
          }
        ]
      },
      {
        path: 'cadguia/:parametro/:dados',
        children: [
          {
            path: '',
            loadChildren: () => import('../cadguia/cadguia.module').then( m => m.CadguiaPageModule)
          }
        ]
      },
      {
        path: 'cadsessao-particular/:id',
        children: [
          {      
            path: '',  
            loadChildren: () => import('../cadsessao-particular/cadsessao-particular.module').then( m => m.CadsessaoParticularPageModule)

          }
        ]
      },
      {
        path: 'filtro-data/:dados',
        children: [
          {
            path: '',
            loadChildren: () => import('../filtro-data/filtro-data.module').then( m => m.FiltroDataPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/menu/pacientes',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/menu/pacientes',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}