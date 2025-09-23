package br.fai.backend.donate.backend.main.port.service.evento;


import br.fai.backend.donate.backend.main.domain.EventoModel;

import java.util.List;

public interface EventoService {

    // Lista todos os eventos/notícias
    List<EventoModel> listarTodos();

    // Busca um evento por ID
    EventoModel listarPorId(Long id);

    // Salva um novo evento/notícia
    EventoModel salvar(EventoModel evento);

    // Atualiza um evento existente
    EventoModel atualizar(Long id, EventoModel evento);

    // Remove um evento pelo ID
    void excluir(Long id);
}
