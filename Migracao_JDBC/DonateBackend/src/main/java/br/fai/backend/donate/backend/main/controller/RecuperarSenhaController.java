package br.fai.backend.donate.backend.main.controller;

import br.fai.backend.donate.backend.main.port.service.recuperar_senha.RecuperarSenhaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/recuperar-senha")
public class RecuperarSenhaController {

    private final RecuperarSenhaService recuperarSenhaService;

    public RecuperarSenhaController(RecuperarSenhaService recuperarSenhaService) {
        this.recuperarSenhaService = recuperarSenhaService;
    }

    // =========================
    // 1️⃣ Enviar código de verificação
    // =========================
    @PostMapping("/enviar-codigo")
    public ResponseEntity<Map<String, Object>> enviarCodigo(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        boolean enviado = recuperarSenhaService.enviarCodigoVerificacao(email);

        Map<String, Object> response = new HashMap<>();
        response.put("sucesso", enviado);
        response.put("mensagem", enviado ? "Código enviado para o seu e-mail" : "Erro ao enviar código");

        return ResponseEntity.ok(response);
    }

    // =========================
    // 2️⃣ Validar código
    // =========================
    @PostMapping("/validar-codigo")
    public ResponseEntity<Map<String, Object>> validarCodigo(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String codigo = body.get("codigo");

        boolean valido = recuperarSenhaService.validarCodigo(email, codigo);

        Map<String, Object> response = new HashMap<>();
        response.put("valido", valido);

        return ResponseEntity.ok(response);
    }

    // =========================
    // 3️⃣ Resetar senha
    // =========================
    @PostMapping("/resetar-senha")
    public ResponseEntity<Map<String, Object>> resetarSenha(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String codigo = body.get("codigo");
        String novaSenha = body.get("novaSenha");

        boolean sucesso = recuperarSenhaService.resetarSenha(email, codigo, novaSenha);

        Map<String, Object> response = new HashMap<>();
        response.put("sucesso", sucesso);
        response.put("mensagem", sucesso ? "Senha atualizada com sucesso" : "Erro ao atualizar senha, código invalido");

        return ResponseEntity.ok(response);
    }
}
