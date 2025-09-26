drop database if exists donate;
create database donate;

\c donate;

-- tabela: unidade_federativa (UF)
create table unidade_federativa (
    id serial primary key,
    nome varchar(100) not null,
    sigla varchar(2) not null unique
);

-- tabela: municipio
create table municipio (
    id serial primary key,
    nome varchar(100) not null,
    id_unidade_federativa integer not null,
    constraint fk_municipio_uf foreign key (id_unidade_federativa) references unidade_federativa(id)
);

-- tabela: usuario
create table usuario (
    id serial primary key,
    nome varchar(100) not null,
    email varchar(100) unique not null,
    telefone varchar(20),
    cpf varchar(11) unique not null,
    senha varchar(100) not null,
    doadora boolean default false,
    receptora boolean default false,
    profissional boolean default false,
    latitude numeric(10,6),
    longitude numeric(10,6),
    id_municipio integer not null,
    constraint fk_usuario_municipio foreign key (id_municipio) references municipio(id)
);

-- tabela: historico_senha
create table historico_senha (
    id serial primary key,
    id_usuario integer not null,
    senha varchar(100) not null,
    data_criacao timestamptz not null default now(),
    constraint fk_historico_senha_usuario foreign key (id_usuario) references usuario(id)
);

-- tabela: recuperar_senha
create table recuperar_senha (
    id serial primary key,
    id_usuario integer not null,
    codigo varchar(10) not null,
    data_expiracao timestamptz not null,
    usado boolean default false,
    constraint fk_recuperar_senha_usuario foreign key (id_usuario) references usuario(id)
);

-- tabela: bancos_de_leite
create table bancos_de_leite (
    id serial primary key,
    nome varchar(100) not null,
    descricao text,
    id_municipio integer not null,
    endereco varchar(255) not null,
    telefone varchar(20) not null,
    latitude numeric(10,6),
    longitude numeric(10,6),
    constraint fk_banco_municipio foreign key (id_municipio) references municipio(id)
);

-- tabela: agenda (agendamento)
create table agenda (
    id serial primary key,
    data_hora timestamptz not null,
    local varchar(255) not null,
    status varchar(50) not null default 'agendado',
    id_usuario integer not null,
    id_bancos_de_leite integer not null,
    constraint fk_agenda_usuario foreign key (id_usuario) references usuario(id),
    constraint fk_agenda_banco foreign key (id_bancos_de_leite) references bancos_de_leite(id)
);

-- tabela: eventos
create table eventos (
    id serial primary key,
    titulo varchar(200) not null,
    descricao text,
    data timestamptz not null,
    tipo varchar(50) not null,
    id_municipio integer not null,
    constraint fk_eventos_municipio foreign key (id_municipio) references municipio(id)
);

-- tabela: doacao (mantida para histórico de doações)
create table doacao (
    id serial primary key,
    id_bancos_de_leite integer not null,
    quantidade_ml integer not null,
    data_doacao timestamptz not null default now(),
    id_usuario integer not null,
    constraint fk_doacao_banco foreign key (id_bancos_de_leite) references bancos_de_leite(id),
    constraint fk_doacao_usuario foreign key (id_usuario) references usuario(id)
);

commit;