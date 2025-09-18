package br.fai.backend.donate.backend.main.service.bancoLeite;

import br.fai.backend.donate.backend.main.domain.BancoLeiteModel;
import br.fai.backend.donate.backend.main.port.dao.bancoLeite.BancoLeiteDao;
import br.fai.backend.donate.backend.main.port.service.bancoLeiteService.BancoLeiteService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BancoLeiteServiceImpl implements BancoLeiteService {

    private final BancoLeiteDao bancoLeiteDao;

    public BancoLeiteServiceImpl(BancoLeiteDao bancoLeiteDao) {
        this.bancoLeiteDao = bancoLeiteDao;
    }

    @Override
    public int create(BancoLeiteModel entity) {
        return bancoLeiteDao.add(entity);
    }

    @Override
    public void delete(int id) {
        bancoLeiteDao.remove(id);
    }

    @Override
    public void update(int id, BancoLeiteModel entity) {
        bancoLeiteDao.updateInformation(id, entity);
    }

    @Override
    public BancoLeiteModel findById(int id) {
        return bancoLeiteDao.readByID(id);
    }

    @Override
    public List<BancoLeiteModel> findAll() {
        return bancoLeiteDao.readAll();
    }

    @Override
    public Map<String, Object> buscarBancoMaisProximo(double latitude, double longitude) {
        List<BancoLeiteModel> bancos = bancoLeiteDao.readAll();
        BancoLeiteModel maisProximo = null;
        double menorDistancia = Double.MAX_VALUE;

        for (BancoLeiteModel banco : bancos) {
            if (banco.getLatitude() != null && banco.getLongitude() != null) {
                double dist = Math.pow(banco.getLatitude() - latitude, 2) +
                        Math.pow(banco.getLongitude() - longitude, 2);
                if (dist < menorDistancia) {
                    menorDistancia = dist;
                    maisProximo = banco;
                }
            }
        }

        if (maisProximo == null) return new HashMap<>();
        Map<String, Object> map = new HashMap<>();
        map.put("id", maisProximo.getId());
        map.put("nome", maisProximo.getNome());
        map.put("endereco", maisProximo.getEndereco());
        map.put("telefone", maisProximo.getTelefone());
        map.put("latitude", maisProximo.getLatitude());
        map.put("longitude", maisProximo.getLongitude());
        return map;
    }
}
