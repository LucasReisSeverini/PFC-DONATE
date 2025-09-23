package br.fai.backend.donate.backend.main.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BancoLeiteModel {

    private Long id;
    private String nome;
    private String endereco;
    private String telefone;
    private Double latitude;
    private Double longitude;

    @JsonProperty("id_municipio")
    private Long idMunicipio;
}
