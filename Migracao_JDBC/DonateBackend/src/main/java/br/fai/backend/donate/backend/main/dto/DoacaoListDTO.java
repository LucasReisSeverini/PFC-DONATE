package br.fai.backend.donate.backend.main.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoacaoListDTO {
    private Long id;
    private LocalDateTime dataDoacao;
    private String status;
    private Integer quantidadeMl;
    private String rua;
    private String numero;
    private String bairro;

    private String nomeUsuario;   // nome da doadora, receptora ou profissional
    private String nomeBanco;     // nome do banco de leite
}
