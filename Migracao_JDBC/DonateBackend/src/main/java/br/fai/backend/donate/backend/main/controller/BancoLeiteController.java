package br.fai.backend.donate.backend.main.controller;

import br.fai.backend.donate.backend.main.domain.BancoLeiteModel;
import br.fai.backend.donate.backend.main.dto.BancoLeiteDto;
import br.fai.backend.donate.backend.main.port.service.bancoLeiteService.BancoLeiteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bancos")
public class BancoLeiteController {

    private final BancoLeiteService bancoLeiteService;

    public BancoLeiteController(BancoLeiteService bancoLeiteService) {
        this.bancoLeiteService = bancoLeiteService;
    }

    // Endpoint para buscar o banco mais próximo retornando DTO
    @GetMapping("/proximo")
    public ResponseEntity<BancoLeiteDto> getBancoMaisProximo(
            @RequestParam double latitude,
            @RequestParam double longitude) {

        BancoLeiteDto banco = bancoLeiteService.buscarBancoMaisProximo(latitude, longitude);

        if (banco == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(banco);
    }

    // Endpoint para listar todos os bancos
    @GetMapping("/listar")
    public ResponseEntity<List<BancoLeiteModel>> listarTodos() {
        List<BancoLeiteModel> bancos = bancoLeiteService.findAll();
        if (bancos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(bancos);
    }

    @PostMapping("/add")
    public ResponseEntity<BancoLeiteModel> adicionarBanco(@RequestBody BancoLeiteModel bancoLeite) {
        try {
            int id = bancoLeiteService.create(bancoLeite);
            bancoLeite.setId((long) id);
            return ResponseEntity.status(201).body(bancoLeite);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
