package br.fai.backend.donate.backend.main.port.dao.user;

public interface UpdatePasswordDao {
    boolean updatePassword(final int id, final String newPassword);
}
