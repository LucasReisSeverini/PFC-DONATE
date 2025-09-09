package com.donate.backend.main.controller;

import com.donate.backend.main.domain.EventoModel;
import com.donate.backend.main.service.EventoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/eventos")
@CrossOrigin(origins = "*") // permite chamadas do frontend Angular
public class EventoController {

    private final EventoService eventoService;

    public EventoController(EventoService eventoService) {
        this.eventoService = eventoService;
    }

    // Listar todos os eventos/notícias
    @GetMapping
    public List<EventoModel> listarEventos() {
        return eventoService.listarTodos();
    }

    // Salvar novo evento/notícia
    @PostMapping
    public EventoModel adicionarEvento(@RequestBody EventoModel evento) {
        return eventoService.salvar(evento);
    }
}
