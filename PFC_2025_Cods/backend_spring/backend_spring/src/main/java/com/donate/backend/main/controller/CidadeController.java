package com.donate.backend.main.controller;

import com.donate.backend.main.domain.CidadeModel;
import com.donate.backend.main.service.CidadeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cidades")
@CrossOrigin(origins = "*")
public class CidadeController {

    private final CidadeService cidadeService;

    public CidadeController(CidadeService cidadeService) {
        this.cidadeService = cidadeService;
    }

    @GetMapping
    public List<CidadeModel> getAll() {
        return cidadeService.findAll();
    }

    @GetMapping("/{id}")
    public CidadeModel getById(@PathVariable Long id) {
        return cidadeService.buscarPorId(id).orElse(null);
    }

    @PostMapping
    public CidadeModel create(@RequestBody CidadeModel cidade) {
        return cidadeService.save(cidade);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        cidadeService.delete(id);
    }
}
