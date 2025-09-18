package br.fai.backend.donate.backend.main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private String nome;
    private String telefone;
    private String senha;
    private String email;
    private String cpf;
    private Boolean doadora;
    private Boolean receptora;
    private Boolean profissional;
    private Double latitude;
    private Double longitude;
}
