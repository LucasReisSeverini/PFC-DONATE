package com.donate.backend.main.service;

import com.donate.backend.main.domain.CidadeModel;
import com.donate.backend.main.repository.CidadeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CidadeService {

    private final CidadeRepository cidadeRepository;

    public CidadeService(CidadeRepository cidadeRepository) {
        this.cidadeRepository = cidadeRepository;
    }

    public List<CidadeModel> findAll() {
        return cidadeRepository.findAll();
    }

    public Optional<CidadeModel> buscarPorId(Long id) {
        return cidadeRepository.findById(id);
    }

    public CidadeModel save(CidadeModel cidade) {
        return cidadeRepository.save(cidade);
    }

    public void delete(Long id) {
        cidadeRepository.deleteById(id);
    }
}
