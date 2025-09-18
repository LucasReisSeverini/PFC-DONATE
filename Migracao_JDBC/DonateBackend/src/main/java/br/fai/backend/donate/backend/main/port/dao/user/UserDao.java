package br.fai.backend.donate.backend.main.port.dao.user;

import br.fai.backend.donate.backend.main.domain.UsuarioModel;
import br.fai.backend.donate.backend.main.port.dao.crud.CrudDao;

public interface UserDao extends CrudDao<UsuarioModel>, ReadByEmailDao, UpdatePasswordDao {
    int add(UsuarioModel entity);
}
