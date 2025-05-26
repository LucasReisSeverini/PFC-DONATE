import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AgendamentoComponent } from './pages/agendamento/agendamento.component';
import { PainelComponent } from './pages/painel/painel.component';
import { BancoProximoComponent } from './pages/banco-proximo/banco-proximo.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { DoacaoComponent } from './pages/doacao/doacao.component';
import {ControleAgendamentoComponent} from './pages/controle-agendamento/controle-agendamento.component';
import { AgendamentoUsuarioComponent } from './pages/agendamento-usuario/agendamento-usuario.component';
import { AuthGuard } from './guards/auth.guard'; // ✅ Importa o guard

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
  { path: 'controle-agendamento', component: ControleAgendamentoComponent, canActivate: [AuthGuard] },
  { path: 'meus-agendamentos', component: AgendamentoUsuarioComponent, canActivate: [AuthGuard] }


];
