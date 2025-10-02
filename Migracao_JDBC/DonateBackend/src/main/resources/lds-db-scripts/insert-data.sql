-- ===============================
-- UNIDADES FEDERATIVAS
-- ===============================
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (1, 'Minas Gerais', 'MG');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (2, 'São Paulo', 'SP');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (3, 'Acre', 'AC');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (4, 'Alagoas', 'AL');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (5, 'Amapá', 'AP');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (6, 'Amazonas', 'AM');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (7, 'Bahia', 'BA');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (8, 'Ceará', 'CE');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (9, 'Distrito Federal', 'DF');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (10, 'Espírito Santo', 'ES');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (11, 'Goiás', 'GO');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (12, 'Maranhão', 'MA');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (13, 'Mato Grosso', 'MT');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (14, 'Mato Grosso do Sul', 'MS');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (15, 'Pará', 'PA');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (16, 'Paraíba', 'PB');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (17, 'Paraná', 'PR');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (18, 'Pernambuco', 'PE');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (19, 'Piauí', 'PI');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (20, 'Rio de Janeiro', 'RJ');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (21, 'Rio Grande do Norte', 'RN');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (22, 'Rio Grande do Sul', 'RS');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (23, 'Rondônia', 'RO');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (24, 'Roraima', 'RR');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (25, 'Santa Catarina', 'SC');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (26, 'Sergipe', 'SE');
INSERT INTO unidade_federativa (id, nome, sigla) VALUES (27, 'Tocantins', 'TO');


-- ===============================
-- MUNICÍPIOS
-- ===============================
INSERT INTO municipio (id, nome, id_unidade_federativa) VALUES (1, 'Belo Horizonte', 1);
INSERT INTO municipio (id, nome, id_unidade_federativa) VALUES (2, 'São Paulo', 2);
INSERT INTO municipio (id, nome, id_unidade_federativa) VALUES (3, 'Santa Rita do Sapucaí', 1);
--
---- ===============================
---- USUÁRIOS
---- ===============================
--INSERT INTO usuario (id, nome, email, telefone, cpf, senha, latitude, longitude, id_municipio, doadora, receptora, profissional)
--VALUES (1, 'Maria Silva', 'maria@email.com', '31988887777', '12345678901', '123', -19.9191, -43.9386, 1, TRUE, FALSE, FALSE);
--
--INSERT INTO usuario (id, nome, email, telefone, cpf, senha, latitude, longitude, id_municipio, doadora, receptora, profissional)
--VALUES (2, 'João Souza', 'joao@email.com', '11999998888', '98765432100', '123', -23.5505, -46.6333, 2, FALSE, FALSE, TRUE);
--
--INSERT INTO usuario (id, nome, email, telefone, cpf, senha, id_municipio, doadora, receptora, profissional)
--VALUES (3, 'Admin', 'admin@teste.com', '11911112222', '11122233344', '123456', 2, FALSE, FALSE, TRUE);
--
---- ===============================
---- BANCOS DE LEITE
---- ===============================
INSERT INTO bancos_de_leite (id, nome, endereco, telefone, latitude, longitude, id_municipio)
VALUES (1, 'Banco de Leite Central', 'Rua A, 100', '3133334444', -19.9191, -43.9386, 1);

INSERT INTO bancos_de_leite (id, nome, endereco, telefone, latitude, longitude, id_municipio)
VALUES (2, 'Banco de Leite Paulista', 'Av. Paulista, 2000', '1144445555', -23.5610, -46.6558, 2);

INSERT INTO bancos_de_leite (id, nome, endereco, telefone, latitude, longitude, id_municipio)
VALUES (3, 'Banco de Leite de Pouso Alegre', 'Rua das Flores, 123', '3534123456', -22.2300, -45.9339, 1);

--
---- ===============================
---- EVENTOS
---- ===============================
INSERT INTO eventos (id, titulo, descricao, data, tipo, id_municipio)
VALUES (1, 'Campanha Doe Leite', 'Evento de arrecadação de leite materno em Minas', '2025-09-20', 'evento', 1);

INSERT INTO eventos (id, titulo, descricao, data, tipo, id_municipio)
VALUES (2, 'Semana da Amamentação', 'Evento educativo sobre aleitamento materno em São Paulo', '2025-08-10', 'noticia', 2);
--
---- ===============================
---- DOAÇÕES
---- ===============================
--INSERT INTO doacao (id, id_bancos_de_leite, quantidade_ml, data_doacao, id_usuario, status)
--VALUES (1, 1, 500, NOW(), 1, 'APROVADA');
--
--INSERT INTO doacao (id, id_bancos_de_leite, quantidade_ml, data_doacao, id_usuario, status)
--VALUES (2, 2, 300, NOW(), 1, 'PENDENTE');
--
--INSERT INTO doacao (id, id_bancos_de_leite, quantidade_ml, data_doacao, id_usuario, status)
--VALUES (3, 1, 450, NOW(), 2, 'APROVADA');
