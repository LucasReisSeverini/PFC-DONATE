package br.fai.backend.donate.backend.main.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MunicipioModel {

    private int id;
    private String nome;

    private UnidadeFederativaModel unidadeFederativa; // referência à UF
}
