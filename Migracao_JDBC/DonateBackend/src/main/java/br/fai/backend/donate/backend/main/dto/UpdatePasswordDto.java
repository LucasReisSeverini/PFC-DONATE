package br.fai.backend.donate.backend.main.dto;

import lombok.Data;

@Data
public class UpdatePasswordDto {
    private int id;
    private String oldPassword;
    private String newPassword;
}
