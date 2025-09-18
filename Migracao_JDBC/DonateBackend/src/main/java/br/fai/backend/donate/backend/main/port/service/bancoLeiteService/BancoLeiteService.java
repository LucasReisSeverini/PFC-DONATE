package br.fai.backend.donate.backend.main.port.service.bancoLeiteService;

import br.fai.backend.donate.backend.main.domain.BancoLeiteModel;
import java.util.List;
import java.util.Map;

public interface BancoLeiteService {

    int create(BancoLeiteModel entity);
    void delete(int id);
    void update(int id, BancoLeiteModel entity);
    BancoLeiteModel findById(int id);
    List<BancoLeiteModel> findAll();
    Map<String, Object> buscarBancoMaisProximo(double latitude, double longitude);
}
