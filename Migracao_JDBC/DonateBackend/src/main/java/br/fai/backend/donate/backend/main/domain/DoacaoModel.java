package br.fai.backend.donate.backend.main.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoacaoModel {

    private int id;
    private LocalDateTime dataDoacao;
    private Integer quantidadeMl;

    private UsuarioModel usuario;
    private BancoLeiteModel bancoDeLeite;
    private String status; // também existe no banco
}
