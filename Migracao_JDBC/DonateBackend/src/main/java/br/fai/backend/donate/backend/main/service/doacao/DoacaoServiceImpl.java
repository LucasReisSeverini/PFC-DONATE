package br.fai.backend.donate.backend.main.service.doacao;

import br.fai.backend.donate.backend.main.domain.DoacaoModel;
import br.fai.backend.donate.backend.main.dto.DoacaoListDTO;
import br.fai.backend.donate.backend.main.port.dao.doacao.DoacaoDao;
import br.fai.backend.donate.backend.main.port.dao.user.UserDao;
import br.fai.backend.donate.backend.main.port.service.doacao.DoacaoService;
import br.fai.backend.donate.backend.main.port.service.email.EmailService;
import br.fai.backend.donate.backend.main.domain.UsuarioModel;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.GrantedAuthority;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class DoacaoServiceImpl implements DoacaoService {

    private final DoacaoDao doacaoDao;
    private final UserDao usuarioDao;
    private final EmailService emailService;

    public DoacaoServiceImpl(DoacaoDao doacaoDao, UserDao usuarioDao, EmailService emailService) {
        this.doacaoDao = doacaoDao;
        this.usuarioDao = usuarioDao;
        this.emailService = emailService;
    }

    @Override
    public List<DoacaoListDTO> buscarTodos() {
        return doacaoDao.listarTodas();
    }

    @Override
    public Optional<DoacaoModel> buscarPorId(Long id) {
        return doacaoDao.buscarPorId(id);
    }

    @Override
    public int salvar(DoacaoModel doacao) {
        return doacaoDao.salvar(doacao);
    }

    @Override
    public int excluir(Long id) {
        return doacaoDao.deletar(id);
    }

    @Override
    public int atualizar(DoacaoModel doacao) {
        return doacaoDao.atualizar(doacao);
    }

    @Override
    public int atualizarStatus(Long id, String novoStatus) {
        Optional<DoacaoModel> optional = doacaoDao.buscarPorId(id);
        if (optional.isPresent()) {
            DoacaoModel doacao = optional.get();
            doacao.setStatus(novoStatus);
            int result = doacaoDao.atualizar(doacao);

            // Enviar notificação por e-mail ao usuário
            notificarUsuario(doacao, novoStatus);

            return result;
        }
        return 0;
    }

    public int reagendar(Long id, LocalDateTime novaDataHora) {
        Optional<DoacaoModel> optional = doacaoDao.buscarPorId(id);
        if (optional.isPresent()) {
            DoacaoModel doacao = optional.get();
            doacao.setDataDoacao(novaDataHora);

            // Pega a role do usuário logado a partir do token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String role = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .findFirst()
                    .orElse("");

            // Define status de acordo com a role
            if ("ROLE_DOADORA".equalsIgnoreCase(role)) {
                doacao.setStatus("Reagendamento Solicitado pela Doadora");
            } else if ("ROLE_PROFISSIONAL".equalsIgnoreCase(role)) {
                doacao.setStatus("Reagendamento Solicitado pelo Profissional de Saúde");
            } else {
                doacao.setStatus("Reagendamento Solicitado"); // fallback genérico
            }

            int result = doacaoDao.atualizar(doacao);

            // Notificar usuário sobre reagendamento usando o status correto
            notificarUsuario(doacao, doacao.getStatus());

            return result;
        }
        return 0;
    }


    @Override
    public boolean existeAgendamento(Long idBanco, LocalDateTime dataHora) {
        return doacaoDao.existeAgendamento(idBanco, dataHora);
    }

    @Override
    public List<DoacaoListDTO> buscarPorUsuarioId(Long idUsuario) {
        return doacaoDao.buscarPorUsuarioId(idUsuario);
    }

    @Override
    public Optional<DoacaoListDTO> buscarPorIdDTO(Long id) {
        return doacaoDao.buscarPorIdDTO(id);
    }

    // ==========================
    // MÉTODOS PRIVADOS
    // ==========================
    // ==========================
// MÉTODOS PRIVADOS
// ==========================
    private void notificarUsuario(DoacaoModel doacao, String statusOuMensagem) {
        // Buscar usuário pelo idUsuario da doação
        UsuarioModel usuario = usuarioDao.readByID(doacao.getUsuarioId().intValue());
        if (usuario == null || usuario.getEmail() == null || usuario.getEmail().isEmpty()) {
            return;
        }

        String status;
        switch (statusOuMensagem.toLowerCase()) {
            case "aceita":
            case "aceito":
                status = "aceito";
                break;
            case "recusada":
            case "recusado":
                status = "recusado";
                break;
            case "reagendamento solicitado":
            case "reagendado":
                status = "reagendado";
                break;
            case "reagendamento solicitado pelo profissional de saúde":
                status = "reagendamento solicitado pelo profissional de saúde";
                break;
            case "reagendamento solicitado pela doadora":
                status = "reagendamento solicitado pela doadora";
                break;
            default:
                status = statusOuMensagem; // passa exatamente o que veio do banco
                break;
        }

        LocalDate data = doacao.getDataDoacao().toLocalDate();
        LocalTime horario = doacao.getDataDoacao().toLocalTime();

        emailService.enviarEmailAgendamento(
                usuario.getEmail(),
                usuario.getNome(),
                status,
                data,
                horario
        );
    }



}
