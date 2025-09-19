package br.fai.backend.donate.backend.main.port.dao.doacao;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import br.fai.backend.donate.backend.main.domain.DoacaoModel;

public interface DoacaoDao {

    int salvar(DoacaoModel doacao);

    List<DoacaoModel> listarTodas();

    Optional<DoacaoModel> buscarPorId(Long id);

    int atualizar(DoacaoModel doacao);

    int deletar(Long id);

    boolean existeAgendamento(Long idBanco, LocalDateTime dataHora);

    List<DoacaoModel> buscarPorUsuarioId(Long idUsuario);
}
