package br.fai.backend.donate.backend.main.port.dao.bancoLeite;

import br.fai.backend.donate.backend.main.domain.BancoLeiteModel;
import java.util.List;

public interface BancoLeiteDao {

    int add(BancoLeiteModel entity);              // Retorna o ID do banco inserido
    void remove(int id);                            // Remove pelo ID
    BancoLeiteModel readByID(int id);              // Busca por ID
    List<BancoLeiteModel> readAll();               // Lista todos os bancos
    void updateInformation(int id, BancoLeiteModel entity); // Atualiza dados
}
