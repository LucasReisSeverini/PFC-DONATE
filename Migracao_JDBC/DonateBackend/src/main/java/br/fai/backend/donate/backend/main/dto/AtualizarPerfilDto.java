package br.fai.backend.donate.backend.main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AtualizarPerfilDto {
    private String nome;
    private String telefone;
    private String senhaAntiga; // nova propriedade para validar senha atual
    private String novaSenha;
}
