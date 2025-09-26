package br.fai.backend.donate.backend.main.port.dao.user;

import br.fai.backend.donate.backend.main.domain.UsuarioModel;
import br.fai.backend.donate.backend.main.port.dao.crud.CrudDao;

import java.sql.SQLException;
import java.util.List;

public interface UserDao extends CrudDao<UsuarioModel>, ReadByEmailDao, UpdatePasswordDao {
    int add(UsuarioModel entity);
    UsuarioModel findByCpf(String cpf);
    UsuarioModel readByCpf(String cpf);
    public List<String> getUltimasSenhas(Long usuarioId, int limite) throws SQLException;

}
