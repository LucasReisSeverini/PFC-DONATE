package com.donate.backend.main.service;

import com.donate.backend.main.domain.EventoModel;
import com.donate.backend.main.repository.EventoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventoService {

    private final EventoRepository eventoRepository;

    public EventoService(EventoRepository eventoRepository) {
        this.eventoRepository = eventoRepository;
    }

    public List<EventoModel> listarTodos() {
        return eventoRepository.findAll();
    }

    public EventoModel salvar(EventoModel evento) {
        return eventoRepository.save(evento);
    }


    // Atualizar
    public EventoModel atualizar(Long id, EventoModel evento) {
        EventoModel existente = eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        existente.setTitulo(evento.getTitulo());
        existente.setDescricao(evento.getDescricao());
        existente.setData(evento.getData());
        existente.setTipo(evento.getTipo());
        existente.setIdCidade(evento.getIdCidade()); // <-- adiciona isso
        return eventoRepository.save(existente);
    }


    // Excluir
    public void excluir(Long id) {
        eventoRepository.deleteById(id);
    }

    public EventoModel listarPorId(Long id) {
        return eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
    }


}
