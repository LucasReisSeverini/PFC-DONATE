package com.donate.backend.main.controller;

import com.donate.backend.main.domain.BancoLeiteModel;
import com.donate.backend.main.service.BancoLeiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bancos")
public class BancoLeiteController {

    @Autowired
    private BancoLeiteService bancoLeiteService;

    @GetMapping("/proximo")
    public ResponseEntity<?> getBancoMaisProximo(
            @RequestParam double latitude,
            @RequestParam double longitude)
             {

        Map<String, Object> banco = bancoLeiteService.buscarBancoMaisProximo(latitude, longitude);



        return ResponseEntity.ok(banco);
    }

    @GetMapping("/listar")
    public List<BancoLeiteModel> listarTodos() {
        return bancoLeiteService.listarTodos();
    }
}
