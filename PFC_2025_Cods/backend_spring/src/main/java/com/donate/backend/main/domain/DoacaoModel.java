package com.donate.backend.main.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "doacao")
public class DoacaoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_doacao")
    private LocalDateTime dataDoacao; // ← data e hora da doação

    private String status;

    @Column(name = "quantidade_ml")
    private Integer quantidadeMl;

    // 🔹 Novos campos de endereço da doadora no momento da doação
    private String rua;

    private String numero;

    private String bairro;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private UsuarioModel usuario;

    @ManyToOne
    @JoinColumn(name = "id_bancos_de_leite")
    private BancoLeiteModel bancoDeLeite;

    // Getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getDataDoacao() { return dataDoacao; }
    public void setDataDoacao(LocalDateTime dataDoacao) { this.dataDoacao = dataDoacao; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getQuantidadeMl() { return quantidadeMl; }
    public void setQuantidadeMl(Integer quantidadeMl) { this.quantidadeMl = quantidadeMl; }

    public String getRua() { return rua; }
    public void setRua(String rua) { this.rua = rua; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }

    public UsuarioModel getUsuario() { return usuario; }
    public void setUsuario(UsuarioModel usuario) { this.usuario = usuario; }

    public BancoLeiteModel getBancoDeLeite() { return bancoDeLeite; }
    public void setBancoDeLeite(BancoLeiteModel bancoDeLeite) { this.bancoDeLeite = bancoDeLeite; }
}
