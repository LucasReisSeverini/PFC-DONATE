package com.donate.backend.main.service;

import com.donate.backend.main.domain.BancoLeiteModel;
import com.donate.backend.main.repository.BancoLeiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class BancoLeiteService {

    @Autowired
    private BancoLeiteRepository bancoLeiteRepository;

    public Map<String, Object> buscarBancoMaisProximo(double latitude, double longitude) {
        return bancoLeiteRepository.buscarMaisProximo(latitude, longitude);
    }

    public List<BancoLeiteModel> listarTodos() {
        return bancoLeiteRepository.findAll(); // listar bancos
    }
}