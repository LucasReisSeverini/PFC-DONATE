package br.fai.backend.donate.backend.main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoacaoDto {
    private String data_doacao;  // ex: "2025-06-10"
    private String hora_doacao;  // ex: "14:30"
    private Integer quantidade_ml;
    private Long id_bancos_de_leite;
    private Long id_usuario;
}
