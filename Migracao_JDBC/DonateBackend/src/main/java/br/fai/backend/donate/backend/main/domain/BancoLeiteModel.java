package br.fai.backend.donate.backend.main.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BancoLeiteModel {

    private int id;          // agora é int
    private String nome;
    private String endereco;
    private String telefone;
    private Double latitude;
    private Double longitude;
}
