package br.fai.backend.donate.backend.main.port.service.doacao;

import br.fai.backend.donate.backend.main.domain.DoacaoModel;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DoacaoService {

    List<DoacaoModel> buscarTodos();

    Optional<DoacaoModel> buscarPorId(Long id);

    int salvar(DoacaoModel doacao);

    int excluir(Long id);

    int atualizar(DoacaoModel doacao);

    int atualizarStatus(Long id, String novoStatus);

    int reagendar(Long id, LocalDateTime novaDataHora);

    boolean existeAgendamento(Long idBanco, LocalDateTime dataHora);

    List<DoacaoModel> buscarPorUsuarioId(Long idUsuario);
}
