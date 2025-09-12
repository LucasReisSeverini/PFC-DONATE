package com.donate.backend.main.dto;

public class DoacaoDto {
    private String data_doacao;  // ex: "2025-06-10"
    private String hora_doacao;  // ex: "14:30"
    private Integer quantidade_ml;
    private Long id_bancos_de_leite;
    private Long id_usuario;

    // 🔹 Novos campos de endereço
    private String rua;
    private String numero;
    private String bairro;

    // Getters e setters
    public String getData_doacao() {
        return data_doacao;
    }

    public void setData_doacao(String data_doacao) {
        this.data_doacao = data_doacao;
    }

    public String getHora_doacao() {
        return hora_doacao;
    }

    public void setHora_doacao(String hora_doacao) {
        this.hora_doacao = hora_doacao;
    }

    public Integer getQuantidade_ml() {
        return quantidade_ml;
    }

    public void setQuantidade_ml(Integer quantidade_ml) {
        this.quantidade_ml = quantidade_ml;
    }

    public Long getId_bancos_de_leite() {
        return id_bancos_de_leite;
    }

    public void setId_bancos_de_leite(Long id_bancos_de_leite) {
        this.id_bancos_de_leite = id_bancos_de_leite;
    }

    public Long getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Long id_usuario) {
        this.id_usuario = id_usuario;
    }

    public String getRua() {
        return rua;
    }

    public void setRua(String rua) {
        this.rua = rua;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }
}
