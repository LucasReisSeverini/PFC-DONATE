package br.fai.backend.donate.backend.main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AtualizarLocalizacaoDto {
    private Double latitude;
    private Double longitude;
}
