import { Routes } from '@angular/router';
import { LoginComponent } from './views/account/login/login.component';
import { RegisterComponent } from './views/account/register/register.component';
import { AgendamentoComponent } from './views/agendamento/agendamento.component';
import { PainelComponent } from './views/painel/painel.component';
import { BancoProximoComponent } from './views/banco-proximo/banco-proximo.component';
import { PerfilComponent } from './views/account/perfil/perfil.component';
import { DoacaoComponent } from './views/doacao/doacao.component';
import { ControleAgendamentoComponent } from './views/controle-agendamento/controle-agendamento.component';
import { AgendamentoUsuarioComponent } from './views/agendamento-usuario/agendamento-usuario.component';
import { AuthGuard } from './guards/auth.guard';
import { AdicionarEventoComponent } from './views/adicionar-evento/adicionar-evento.component';
import { EventosViewsComponent } from './views/eventos-views/eventos-views.component';
import { GerenciarEventosComponent } from './views/gerenciar-eventos/gerenciar-eventos.component';
import { EditEventoComponent } from './views/edit-evento/edit-evento.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: RegisterComponent },

  // Rotas protegidas
  { path: 'agendamento', component: AgendamentoComponent, canActivate: [AuthGuard] },
  { path: 'painel', component: PainelComponent, canActivate: [AuthGuard] },
  { path: 'banco-proximo', component: BancoProximoComponent, canActivate: [AuthGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
  { path: 'doacao', component: DoacaoComponent, canActivate: [AuthGuard] },
  {
    path: 'controle-agendamento',
    component: ControleAgendamentoComponent,
    canActivate: [AuthGuard],
    data: { allowedRoles: ['PROFISSIONAL'] }
  },
  { path: 'meus-agendamentos', component: AgendamentoUsuarioComponent, canActivate: [AuthGuard] },
  {
    path: 'adicionar-evento',
    component: AdicionarEventoComponent,
    canActivate: [AuthGuard],
    data: { allowedRoles: ['PROFISSIONAL'] }
  },
  {
    path: 'gerenciar-eventos',
    component: GerenciarEventosComponent,
    canActivate: [AuthGuard],
    data: { allowedRoles: ['PROFISSIONAL'] }
  },
  {
    path: 'editar-evento/:id',
    component: EditEventoComponent,
    canActivate: [AuthGuard],
    data: { allowedRoles: ['PROFISSIONAL'] }
  },

  // Rota pública
  { path: 'eventos', component: EventosViewsComponent }
];
