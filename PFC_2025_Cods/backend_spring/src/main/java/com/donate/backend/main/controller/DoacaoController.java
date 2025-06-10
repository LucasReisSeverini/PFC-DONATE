package com.donate.backend.main.controller;

import com.donate.backend.main.domain.BancoLeiteModel;
import com.donate.backend.main.domain.DoacaoModel;
import com.donate.backend.main.domain.UsuarioModel;
import com.donate.backend.main.dto.DoacaoDto;
import com.donate.backend.main.repository.BancoLeiteRepository;
import com.donate.backend.main.repository.UsuarioRepository;
import com.donate.backend.main.service.DoacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/doacoes")
@CrossOrigin(origins = "*")
public class DoacaoController {

    @Autowired
    private DoacaoService doacaoService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private BancoLeiteRepository bancoLeiteRepository;

    // GET: Buscar todas as doações
    @GetMapping
    public List<DoacaoModel> buscarTodas() {
        return doacaoService.buscarTodos();

    }

    // GET: Buscar doações por id do usuário
    @GetMapping("/usuario/{idUsuario}")
    public List<DoacaoModel> buscarPorUsuario(@PathVariable Long idUsuario) {
        return doacaoService.buscarPorUsuarioId(idUsuario);
    }

    // GET: Buscar por ID da doação
    @GetMapping("/{id}")
    public ResponseEntity<DoacaoModel> buscarPorId(@PathVariable Long id) {
        Optional<DoacaoModel> doacao = doacaoService.buscarPorId(id);
        return doacao.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // POST: Criar nova doação
    @PostMapping
    public ResponseEntity<DoacaoModel> criar(@RequestBody DoacaoDto dto) {
        DoacaoModel doacao = new DoacaoModel();

        // Monta LocalDateTime juntando data e hora (ex: "2025-06-10T14:30")
        String dataHoraStr = dto.getData_doacao() + "T" + dto.getHora_doacao();
        LocalDateTime dataHora = LocalDateTime.parse(dataHoraStr);
        doacao.setDataDoacao(dataHora);

        doacao.setQuantidadeMl(dto.getQuantidade_ml());
        doacao.setStatus("pendente");

        BancoLeiteModel banco = bancoLeiteRepository.findById(dto.getId_bancos_de_leite())
                .orElseThrow(() -> new RuntimeException("Banco de leite não encontrado"));
        doacao.setBancoDeLeite(banco);

        UsuarioModel usuario = usuarioRepository.findById(dto.getId_usuario())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        doacao.setUsuario(usuario);

        DoacaoModel salva = doacaoService.salvar(doacao);
        return ResponseEntity.ok(salva);
    }

    // PUT: Atualizar status da doação
    @PutMapping("/{id}/status")
    public ResponseEntity<Void> atualizarStatus(@PathVariable Long id, @RequestBody String novoStatus) {
        doacaoService.atualizarStatus(id, novoStatus.replace("\"", "")); // remove aspas do JSON
        return ResponseEntity.ok().build();
    }

    // PUT: Reagendar doação
    @PutMapping("/{id}/reagendar")
    public ResponseEntity<Void> reagendar(@PathVariable Long id, @RequestBody String novaData) {
        doacaoService.reagendar(id, LocalDateTime.parse(novaData.replace("\"", "")));
        return ResponseEntity.ok().build();
    }

    // DELETE: Excluir doação
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        doacaoService.excluir(id);
        return ResponseEntity.noContent().build();
    }

}
