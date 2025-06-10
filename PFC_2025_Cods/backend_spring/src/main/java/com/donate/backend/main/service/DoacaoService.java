package com.donate.backend.main.service;

import com.donate.backend.main.domain.DoacaoModel;
import com.donate.backend.main.repository.DoacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DoacaoService {

    @Autowired
    private DoacaoRepository doacaoRepository;

    public List<DoacaoModel> buscarTodos() {
        return doacaoRepository.findAll();
    }

    public List<DoacaoModel> buscarPorUsuarioId(Long idUsuario) {
        return doacaoRepository.findByUsuarioId(idUsuario);
    }

    public Optional<DoacaoModel> buscarPorId(Long id) {
        return doacaoRepository.findById(id);
    }

    public DoacaoModel salvar(DoacaoModel doacao) {
        return doacaoRepository.save(doacao);
    }

    public void excluir(Long id) {
        doacaoRepository.deleteById(id);
    }

    public void atualizarStatus(Long id, String novoStatus) {
        Optional<DoacaoModel> optional = doacaoRepository.findById(id);
        if (optional.isPresent()) {
            DoacaoModel doacao = optional.get();
            doacao.setStatus(novoStatus);
            doacaoRepository.save(doacao);
        }
    }

    public void reagendar(Long id, LocalDateTime novaDataHora) {
        Optional<DoacaoModel> optional = doacaoRepository.findById(id);
        if (optional.isPresent()) {
            DoacaoModel doacao = optional.get();
            doacao.setDataDoacao(novaDataHora);
            doacao.setStatus("reagendado");
            doacaoRepository.save(doacao);
        }
    }
}
