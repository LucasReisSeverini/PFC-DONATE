package br.fai.backend.donate.backend.main.domain;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoacaoModel {

    private Long id;
    private LocalDateTime dataDoacao; // data e hora da doação
    private String status;
    private Integer quantidadeMl;

    // Endereço da doadora no momento da doação
    private String rua;
    private String numero;
    private String bairro;


    private Long usuarioId;
    private Long bancoDeLeiteId;
}
