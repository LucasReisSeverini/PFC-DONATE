package br.fai.backend.donate.backend.main.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioModel {

    private int id;
    private String nome;
    private String telefone;
    private String senha;
    private String email;
    private String cpf;

    private Double latitude;
    private Double longitude;

    private Boolean doadora;
    private Boolean receptora;
    private Boolean profissional;

    @JsonProperty("id_municipio")
    private Integer idMunicipio;
}
