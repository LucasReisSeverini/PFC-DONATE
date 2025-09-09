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

    // Editar um evento existente
    @PutMapping("/{id}")
    public EventoModel atualizarEvento(@PathVariable Long id, @RequestBody EventoModel evento) {
        return eventoService.atualizar(id, evento);
    }

    // Excluir um evento/notícia pelo ID
    @DeleteMapping("/{id}")
    public void excluirEvento(@PathVariable Long id) {
        eventoService.excluir(id);
    }

    // Buscar evento por ID
    @GetMapping("/{id}")
    public EventoModel buscarEventoPorId(@PathVariable Long id) {
        return eventoService.listarPorId(id);
    }

}
