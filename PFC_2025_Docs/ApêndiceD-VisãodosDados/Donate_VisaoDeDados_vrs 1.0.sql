drop database if exists donate;
create database donate;

\c donate;

-- Tabela: cidade
CREATE TABLE cidade (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    estado VARCHAR(100) NOT NULL
);

-- Tabela: usuario
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    cpf VARCHAR(11) NOT NULL,
    senha VARCHAR(100) NOT NULL,
    doadora BOOLEAN,
    receptora BOOLEAN,
    profissional BOOLEAN,
    latitude NUMERIC(8,6),
    longitude NUMERIC(8,6),
    id_cidade INTEGER NOT NULL,
    CONSTRAINT fk_usuario_cidade FOREIGN KEY (id_cidade) REFERENCES cidade(id)
);

-- Tabela: bancos_de_leite
CREATE TABLE bancos_de_leite (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(25) NOT NULL,
    cidade VARCHAR(10) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    latitude NUMERIC(8,6),
    longitude NUMERIC(8,6)
);


-- Tabela: doacao
CREATE TABLE doacao (
    id SERIAL PRIMARY KEY,
    id_bancos_de_leite INTEGER NOT NULL,
    quantidade_ml INTEGER NOT NULL,
    data_doacao TIMESTAMPTZ NOT NULL,
    id_usuario INTEGER NOT NULL,
    CONSTRAINT fk_doacao_banco FOREIGN KEY (id_bancos_de_leite) REFERENCES bancos_de_leite(id),
    CONSTRAINT fk_doacao_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);

commit;