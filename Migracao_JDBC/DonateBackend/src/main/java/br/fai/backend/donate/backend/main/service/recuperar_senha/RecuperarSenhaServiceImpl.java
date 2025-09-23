package br.fai.backend.donate.backend.main.service.recuperar_senha;

import br.fai.backend.donate.backend.main.port.dao.recuperar_senha.RecuperarSenhaDao;
import br.fai.backend.donate.backend.main.port.service.recuperar_senha.RecuperarSenhaService;
import br.fai.backend.donate.backend.main.port.service.user.UserService;
import br.fai.backend.donate.backend.main.domain.UsuarioModel;
import br.fai.backend.donate.backend.main.port.service.email.EmailService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class RecuperarSenhaServiceImpl implements RecuperarSenhaService {

    private final RecuperarSenhaDao recuperarSenhaDao;
    private final UserService userService;
    private final EmailService emailService;

    public RecuperarSenhaServiceImpl(RecuperarSenhaDao recuperarSenhaDao, UserService userService, EmailService emailService) {
        this.recuperarSenhaDao = recuperarSenhaDao;
        this.userService = userService;
        this.emailService = emailService;
    }

    @Override
    public boolean enviarCodigoVerificacao(String email) {
        UsuarioModel usuario = userService.findByEmail(email);
        if (usuario == null) return false;

        // Gera código de 6 dígitos
        String codigo = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime expiracao = LocalDateTime.now().plusMinutes(15);

        // Salva no banco
        recuperarSenhaDao.salvarCodigo(usuario.getId(), codigo, expiracao);

        // Envia por e-mail
        String assunto = "Código de verificação para redefinição de senha";
        String corpo = String.format(
                "Olá %s,\n\nSeu código para redefinir a senha é: %s\nEle expira em 15 minutos.\n\nAtenciosamente,\nEquipe Donate",
                usuario.getNome(),
                codigo
        );

        emailService.enviarEmailSimples(email, assunto, corpo);
        return true;
    }

    @Override
    public boolean validarCodigo(String email, String codigo) {
        UsuarioModel usuario = userService.findByEmail(email);
        if (usuario == null) return false;

        return recuperarSenhaDao.validarCodigo(usuario.getId(), codigo);
    }

    @Override
    public boolean resetarSenha(String email, String codigo, String novaSenha) {
        UsuarioModel usuario = userService.findByEmail(email);
        if (usuario == null) return false;

        // Valida código
        if (!recuperarSenhaDao.validarCodigo(usuario.getId(), codigo)) return false;

        // Atualiza senha
        boolean atualizado = userService.recoveryPassword(usuario.getId(), novaSenha);

        // Marca código como usado
        if (atualizado) {
            recuperarSenhaDao.marcarComoUsado(usuario.getId(), codigo);
        }

        return atualizado;
    }
}
