package br.fai.backend.donate.backend.main.port.service.doacao;

import br.fai.backend.donate.backend.main.domain.DoacaoModel;
import br.fai.backend.donate.backend.main.dto.DoacaoListDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DoacaoService {

    /**
     * Retorna todas as doações em forma de DTO.
     */
    List<DoacaoListDTO> buscarTodos();

    /**
     * Busca uma doação pelo ID, retornando o modelo completo.
     */
    Optional<DoacaoModel> buscarPorId(Long id);

    /**
     * Salva uma nova doação.
     */
    int salvar(DoacaoModel doacao);

    /**
     * Exclui uma doação pelo ID.
     */
    int excluir(Long id);

    /**
     * Atualiza uma doação existente.
     */
    int atualizar(DoacaoModel doacao);

    /**
     * Atualiza apenas o status de uma doação.
     */
    int atualizarStatus(Long id, String novoStatus);

    /**
     * Reagenda uma doação para uma nova data e hora.
     */
    int reagendar(Long id, LocalDateTime novaDataHora);

    /**
     * Verifica se já existe um agendamento no banco de leite para a data e hora especificadas.
     */
    boolean existeAgendamento(Long idBanco, LocalDateTime dataHora);

    /**
     * Retorna todas as doações de um usuário em forma de DTO.
     */
    List<DoacaoListDTO> buscarPorUsuarioId(Long idUsuario);

    /**
     * Retorna uma doação específica em forma de DTO.
     */
    Optional<DoacaoListDTO> buscarPorIdDTO(Long id);
}
