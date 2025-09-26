package br.fai.backend.donate.backend.main.controller;

import br.fai.backend.donate.backend.main.domain.DoacaoModel;
import br.fai.backend.donate.backend.main.dto.DoacaoDto;
import br.fai.backend.donate.backend.main.dto.DoacaoListDTO;
import br.fai.backend.donate.backend.main.port.dao.doacao.DoacaoDao;
import br.fai.backend.donate.backend.main.port.dao.bancoLeite.BancoLeiteDao;
import br.fai.backend.donate.backend.main.port.dao.user.UserDao;
import br.fai.backend.donate.backend.main.port.service.doacao.DoacaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
@RestController
@RequestMapping("/doacoes")
@CrossOrigin(origins = "*")
public class DoacaoController {

    private final DoacaoService doacaoService;
    private final UserDao usuarioDao;
    private final BancoLeiteDao bancoLeiteDao;

    public DoacaoController(DoacaoService doacaoService, UserDao usuarioDao, BancoLeiteDao bancoLeiteDao) {
        this.doacaoService = doacaoService;
        this.usuarioDao = usuarioDao;
        this.bancoLeiteDao = bancoLeiteDao;
    }

    @GetMapping
    public List<DoacaoListDTO> buscarTodas() {
        return doacaoService.buscarTodos();
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<DoacaoListDTO> buscarPorUsuario(@PathVariable Long idUsuario) {
        return doacaoService.buscarPorUsuarioId(idUsuario);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoacaoListDTO> buscarPorId(@PathVariable Long id) {
        Optional<DoacaoListDTO> doacaoDTO = doacaoService.buscarPorIdDTO(id);
        return doacaoDTO.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DoacaoListDTO> criar(@RequestBody DoacaoDto dto) {
        String dataHoraStr = dto.getData_doacao() + "T" + dto.getHora_doacao();
        LocalDateTime dataHora = LocalDateTime.parse(dataHoraStr);

        boolean existe = doacaoService.existeAgendamento(dto.getId_bancos_de_leite(), dataHora);
        if (existe) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(null); // ou mensagem de conflito, mas retornando DTO nulo
        }

        DoacaoModel doacao = new DoacaoModel();
        doacao.setDataDoacao(dataHora);
        doacao.setQuantidadeMl(dto.getQuantidade_ml());
        doacao.setStatus("pendente");
        doacao.setRua(dto.getRua());
        doacao.setNumero(dto.getNumero());
        doacao.setBairro(dto.getBairro());
        doacao.setBancoDeLeiteId(dto.getId_bancos_de_leite());
        doacao.setUsuarioId(dto.getId_usuario());

        int idSalvo = doacaoService.salvar(doacao);
        doacao.setId((long) idSalvo);

        // Retornar DTO com nomes preenchidos
        Optional<DoacaoListDTO> dtoSalvo = doacaoService.buscarPorIdDTO(doacao.getId());
        return dtoSalvo.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> atualizarStatus(@PathVariable Long id, @RequestBody String novoStatus) {
        doacaoService.atualizarStatus(id, novoStatus.replace("\"", ""));
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/reagendar")
    public ResponseEntity<DoacaoListDTO> reagendar(@PathVariable Long id, @RequestBody String novaData) {
        doacaoService.reagendar(id, LocalDateTime.parse(novaData.replace("\"", "")));

        // Buscar novamente a doação atualizada como DTO
        Optional<DoacaoListDTO> doacaoAtualizada = doacaoService.buscarPorIdDTO(id);

        return doacaoAtualizada.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        doacaoService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/aceitar")
    @PreAuthorize("hasRole('PROFISSIONAL') or hasRole('DOADORA')")
    public ResponseEntity<Void> aceitar(@PathVariable Long id) {
        doacaoService.atualizarStatus(id, "Aceito");
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/recusar")
    @PreAuthorize("hasRole('PROFISSIONAL') or hasRole('DOADORA')")
    public ResponseEntity<Void> recusar(@PathVariable Long id) {
        doacaoService.atualizarStatus(id, "Recusado");
        return ResponseEntity.ok().build();
    }

}
