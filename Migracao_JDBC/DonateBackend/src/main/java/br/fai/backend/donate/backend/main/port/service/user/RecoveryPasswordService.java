package br.fai.backend.donate.backend.main.port.service.user;

public interface RecoveryPasswordService {
    boolean recoveryPassword(final int id, final String newPassword);
}
