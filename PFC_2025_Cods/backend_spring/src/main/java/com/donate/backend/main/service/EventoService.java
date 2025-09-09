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
}
