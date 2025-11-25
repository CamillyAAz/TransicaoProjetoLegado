USE bdvendas;

-- Limpar dados anteriores (caso necessário)
-- DELETE FROM tb_itens_venda;
-- DELETE FROM tb_vendas;
-- DELETE FROM tb_movimentacoes_estoque;
-- DELETE FROM tb_produtos;
-- DELETE FROM tb_clientes;
-- DELETE FROM tb_funcionarios;
-- DELETE FROM tb_fornecedores;

-- Inserir APENAS os produtos que faltam (50 produtos total)
-- Fornecedores já existem com IDs 3-27 (25 fornecedores)

-- Inserir 25 clientes (se ainda não existem)
-- Verificar ID máximo antes de inserir
INSERT INTO tb_clientes (nome, rg, cpf, email, telefone, celular, cep, endereco, numero, complemento, bairro, cidade, estado)
SELECT 'Cliente 1', NULL, '30000000001', 'cliente1@exemplo.com', '11980000001', '11981000001','02000000','Rua Cliente 1',1,'','Centro','Cidade','SP'
UNION ALL
SELECT 'Cliente 2', NULL, '30000000002', 'cliente2@exemplo.com', '11980000002', '11981000002','02000000','Rua Cliente 2',2,'','Centro','Cidade','SP'
UNION ALL
SELECT 'Cliente 3', NULL, '30000000003', 'cliente3@exemplo.com', '11980000003', '11981000003','02000000','Rua Cliente 3',3,'','Centro','Cidade','SP'
UNION ALL
SELECT 'Cliente 4', NULL, '30000000004', 'cliente4@exemplo.com', '11980000004', '11981000004','02000000','Rua Cliente 4',4,'','Centro','Cidade','SP'
UNION ALL
SELECT 'Cliente 5', NULL, '30000000005', 'cliente5@exemplo.com', '11980000005', '11981000005','02000000','Rua Cliente 5',5,'','Centro','Cidade','SP'
UNION ALL
SELECT 'Cliente 6', NULL, '30000000006', 'cliente6@exemplo.com', '11980000006', '11981000006','02000000','Rua Cliente 6',6,'','Centro','Cidade','SP'
UNION ALL
SELECT 'Cliente 7', NULL, '30000000007', 'cliente7@exemplo.com', '11980000007', '11981000007','02000000','Rua Cliente 7',7,'','Centro','Cidade','SP'
UNION ALL
SELECT 'Cliente 8', NULL, '30000000008', 'cliente8@exemplo.com', '11980000008', '11981000008','02000000','Rua Cliente 8',8,'','Centro','Cidade','SP'
UNION ALL
SELECT 'Cliente 9', NULL, '30000000009', 'cliente9@exemplo.com', '11980000009', '11981000009','02000000','Rua Cliente 9',9,'','Centro','Cidade','SP'
UNION ALL
SELECT 'Cliente 10', NULL, '30000000010', 'cliente10@exemplo.com', '11980000010', '11981000010','02000000','Rua Cliente 10',10,'','Centro','Cidade','SP'
UNION ALL
SELECT 'Cliente 11', NULL, '30000000011', 'cliente11@exemplo.com', '11980000011', '11981000011','02000000','Rua Cliente 11',11,'','Centro','Cidade','SP'
UNION ALL
SELECT 'Cliente 12', NULL, '30000000012', 'cliente12@exemplo.com', '11980000012', '11981000012','02000000','Rua Cliente 12',12,'','Centro','Cidade','SP'
UNION ALL
SELECT 'Cliente 13', NULL, '30000000013', 'cliente13@exemplo.com', '11980000013', '11981000013','02000000','Rua Cliente 13',13,'','Centro','Cidade','SP'
UNION ALL
SELECT 'Cliente 14', NULL, '30000000014', 'cliente14@exemplo.com', '11980000014', '11981000014','02000000','Rua Cliente 14',14,'','Centro','Cidade','SP'
UNION ALL
SELECT 'Cliente 15', NULL, '30000000015', 'cliente15@exemplo.com', '11980000015', '11981000015','02000000','Rua Cliente 15',15,'','Centro','Cidade','SP'
UNION ALL
SELECT 'Cliente 16', NULL, '30000000016', 'cliente16@exemplo.com', '11980000016', '11981000016','02000000','Rua Cliente 16',16,'','Centro','Cidade','SP'
UNION ALL
SELECT 'Cliente 17', NULL, '30000000017', 'cliente17@exemplo.com', '11980000017', '11981000017','02000000','Rua Cliente 17',17,'','Centro','Cidade','SP'
UNION ALL
SELECT 'Cliente 18', NULL, '30000000018', 'cliente18@exemplo.com', '11980000018', '11981000018','02000000','Rua Cliente 18',18,'','Centro','Cidade','SP'
UNION ALL
SELECT 'Cliente 19', NULL, '30000000019', 'cliente19@exemplo.com', '11980000019', '11981000019','02000000','Rua Cliente 19',19,'','Centro','Cidade','SP'
UNION ALL
SELECT 'Cliente 20', NULL, '30000000020', 'cliente20@exemplo.com', '11980000020', '11981000020','02000000','Rua Cliente 20',20,'','Centro','Cidade','SP'
UNION ALL
SELECT 'Cliente 21', NULL, '30000000021', 'cliente21@exemplo.com', '11980000021', '11981000021','02000000','Rua Cliente 21',21,'','Centro','Cidade','SP'
UNION ALL
SELECT 'Cliente 22', NULL, '30000000022', 'cliente22@exemplo.com', '11980000022', '11981000022','02000000','Rua Cliente 22',22,'','Centro','Cidade','SP'
UNION ALL
SELECT 'Cliente 23', NULL, '30000000023', 'cliente23@exemplo.com', '11980000023', '11981000023','02000000','Rua Cliente 23',23,'','Centro','Cidade','SP'
UNION ALL
SELECT 'Cliente 24', NULL, '30000000024', 'cliente24@exemplo.com', '11980000024', '11981000024','02000000','Rua Cliente 24',24,'','Centro','Cidade','SP'
UNION ALL
SELECT 'Cliente 25', NULL, '30000000025', 'cliente25@exemplo.com', '11980000025', '11981000025','02000000','Rua Cliente 25',25,'','Centro','Cidade','SP'
WHERE NOT EXISTS (SELECT 1 FROM tb_clientes WHERE cpf = '30000000001');

-- Inserir 25 funcionários (password será um text placeholder, is_superuser=0, is_active=1, is_staff=0)
INSERT INTO tb_funcionarios (password, is_superuser, nome, email, is_active, is_staff)
SELECT 'x', 0, 'Funcionario 1', 'func1@exemplo.com', 1, 0
UNION ALL SELECT 'x', 0, 'Funcionario 2', 'func2@exemplo.com', 1, 0
UNION ALL SELECT 'x', 0, 'Funcionario 3', 'func3@exemplo.com', 1, 0
UNION ALL SELECT 'x', 0, 'Funcionario 4', 'func4@exemplo.com', 1, 0
UNION ALL SELECT 'x', 0, 'Funcionario 5', 'func5@exemplo.com', 1, 0
UNION ALL SELECT 'x', 0, 'Funcionario 6', 'func6@exemplo.com', 1, 0
UNION ALL SELECT 'x', 0, 'Funcionario 7', 'func7@exemplo.com', 1, 0
UNION ALL SELECT 'x', 0, 'Funcionario 8', 'func8@exemplo.com', 1, 0
UNION ALL SELECT 'x', 0, 'Funcionario 9', 'func9@exemplo.com', 1, 0
UNION ALL SELECT 'x', 0, 'Funcionario 10', 'func10@exemplo.com', 1, 0
UNION ALL SELECT 'x', 0, 'Funcionario 11', 'func11@exemplo.com', 1, 0
UNION ALL SELECT 'x', 0, 'Funcionario 12', 'func12@exemplo.com', 1, 0
UNION ALL SELECT 'x', 0, 'Funcionario 13', 'func13@exemplo.com', 1, 0
UNION ALL SELECT 'x', 0, 'Funcionario 14', 'func14@exemplo.com', 1, 0
UNION ALL SELECT 'x', 0, 'Funcionario 15', 'func15@exemplo.com', 1, 0
UNION ALL SELECT 'x', 0, 'Funcionario 16', 'func16@exemplo.com', 1, 0
UNION ALL SELECT 'x', 0, 'Funcionario 17', 'func17@exemplo.com', 1, 0
UNION ALL SELECT 'x', 0, 'Funcionario 18', 'func18@exemplo.com', 1, 0
UNION ALL SELECT 'x', 0, 'Funcionario 19', 'func19@exemplo.com', 1, 0
UNION ALL SELECT 'x', 0, 'Funcionario 20', 'func20@exemplo.com', 1, 0
UNION ALL SELECT 'x', 0, 'Funcionario 21', 'func21@exemplo.com', 1, 0
UNION ALL SELECT 'x', 0, 'Funcionario 22', 'func22@exemplo.com', 1, 0
UNION ALL SELECT 'x', 0, 'Funcionario 23', 'func23@exemplo.com', 1, 0
UNION ALL SELECT 'x', 0, 'Funcionario 24', 'func24@exemplo.com', 1, 0
UNION ALL SELECT 'x', 0, 'Funcionario 25', 'func25@exemplo.com', 1, 0
WHERE NOT EXISTS (SELECT 1 FROM tb_funcionarios WHERE email = 'func1@exemplo.com');

-- Inserir 50 produtos (atribuir fornecedores em round-robin IDs 3-27)
INSERT INTO tb_produtos (descricao, preco, qtd_estoque, for_id)
SELECT 'Produto 1', 11.00, 100, 3 UNION ALL
SELECT 'Produto 2', 12.00, 100, 4 UNION ALL
SELECT 'Produto 3', 13.00, 100, 5 UNION ALL
SELECT 'Produto 4', 14.00, 100, 6 UNION ALL
SELECT 'Produto 5', 15.00, 100, 7 UNION ALL
SELECT 'Produto 6', 16.00, 100, 8 UNION ALL
SELECT 'Produto 7', 17.00, 100, 9 UNION ALL
SELECT 'Produto 8', 18.00, 100, 10 UNION ALL
SELECT 'Produto 9', 19.00, 100, 11 UNION ALL
SELECT 'Produto 10', 20.00, 100, 12 UNION ALL
SELECT 'Produto 11', 21.00, 100, 13 UNION ALL
SELECT 'Produto 12', 22.00, 100, 14 UNION ALL
SELECT 'Produto 13', 23.00, 100, 15 UNION ALL
SELECT 'Produto 14', 24.00, 100, 16 UNION ALL
SELECT 'Produto 15', 25.00, 100, 17 UNION ALL
SELECT 'Produto 16', 26.00, 100, 18 UNION ALL
SELECT 'Produto 17', 27.00, 100, 19 UNION ALL
SELECT 'Produto 18', 28.00, 100, 20 UNION ALL
SELECT 'Produto 19', 29.00, 100, 21 UNION ALL
SELECT 'Produto 20', 30.00, 100, 22 UNION ALL
SELECT 'Produto 21', 31.00, 100, 23 UNION ALL
SELECT 'Produto 22', 32.00, 100, 24 UNION ALL
SELECT 'Produto 23', 33.00, 100, 25 UNION ALL
SELECT 'Produto 24', 34.00, 100, 26 UNION ALL
SELECT 'Produto 25', 35.00, 100, 27 UNION ALL
SELECT 'Produto 26', 36.00, 100, 3 UNION ALL
SELECT 'Produto 27', 37.00, 100, 4 UNION ALL
SELECT 'Produto 28', 38.00, 100, 5 UNION ALL
SELECT 'Produto 29', 39.00, 100, 6 UNION ALL
SELECT 'Produto 30', 40.00, 100, 7 UNION ALL
SELECT 'Produto 31', 41.00, 100, 8 UNION ALL
SELECT 'Produto 32', 42.00, 100, 9 UNION ALL
SELECT 'Produto 33', 43.00, 100, 10 UNION ALL
SELECT 'Produto 34', 44.00, 100, 11 UNION ALL
SELECT 'Produto 35', 45.00, 100, 12 UNION ALL
SELECT 'Produto 36', 46.00, 100, 13 UNION ALL
SELECT 'Produto 37', 47.00, 100, 14 UNION ALL
SELECT 'Produto 38', 48.00, 100, 15 UNION ALL
SELECT 'Produto 39', 49.00, 100, 16 UNION ALL
SELECT 'Produto 40', 50.00, 100, 17 UNION ALL
SELECT 'Produto 41', 51.00, 100, 18 UNION ALL
SELECT 'Produto 42', 52.00, 100, 19 UNION ALL
SELECT 'Produto 43', 53.00, 100, 20 UNION ALL
SELECT 'Produto 44', 54.00, 100, 21 UNION ALL
SELECT 'Produto 45', 55.00, 100, 22 UNION ALL
SELECT 'Produto 46', 56.00, 100, 23 UNION ALL
SELECT 'Produto 47', 57.00, 100, 24 UNION ALL
SELECT 'Produto 48', 58.00, 100, 25 UNION ALL
SELECT 'Produto 49', 59.00, 100, 26 UNION ALL
SELECT 'Produto 50', 60.00, 100, 27
WHERE NOT EXISTS (SELECT 1 FROM tb_produtos WHERE descricao = 'Produto 1');

-- Inserir 40 vendas (distribuindo clientes 1-25 e funcionários 1-25)
INSERT INTO tb_vendas (data_venda, total, observacao, cli_id, fun_id)
SELECT NOW(), 0.00, 'Venda teste 1', 1, 1 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 2', 2, 2 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 3', 3, 3 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 4', 4, 4 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 5', 5, 5 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 6', 6, 6 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 7', 7, 7 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 8', 8, 8 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 9', 9, 9 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 10', 10, 10 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 11', 11, 11 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 12', 12, 12 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 13', 13, 13 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 14', 14, 14 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 15', 15, 15 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 16', 16, 16 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 17', 17, 17 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 18', 18, 18 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 19', 19, 19 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 20', 20, 20 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 21', 21, 21 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 22', 22, 22 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 23', 23, 23 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 24', 24, 24 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 25', 25, 25 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 26', 1, 1 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 27', 2, 2 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 28', 3, 3 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 29', 4, 4 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 30', 5, 5 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 31', 6, 6 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 32', 7, 7 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 33', 8, 8 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 34', 9, 9 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 35', 10, 10 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 36', 11, 11 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 37', 12, 12 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 38', 13, 13 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 39', 14, 14 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 40', 15, 15
WHERE NOT EXISTS (SELECT 1 FROM tb_vendas WHERE observacao = 'Venda teste 1');

-- Inserir 60 itens de venda (3 itens por venda, para 20 vendas)
INSERT INTO tb_itens_venda (quantidade, preco_unitario, subtotal, pro_id, ven_id)
SELECT 2, 11.00, 22.00, 1, 1 UNION ALL
SELECT 1, 12.00, 12.00, 2, 1 UNION ALL
SELECT 3, 13.00, 39.00, 3, 1 UNION ALL
SELECT 1, 14.00, 14.00, 4, 2 UNION ALL
SELECT 2, 15.00, 30.00, 5, 2 UNION ALL
SELECT 1, 16.00, 16.00, 6, 2 UNION ALL
SELECT 1, 17.00, 17.00, 7, 3 UNION ALL
SELECT 2, 18.00, 36.00, 8, 3 UNION ALL
SELECT 1, 19.00, 19.00, 9, 3 UNION ALL
SELECT 1, 20.00, 20.00, 10, 4 UNION ALL
SELECT 2, 21.00, 42.00, 11, 4 UNION ALL
SELECT 1, 22.00, 22.00, 12, 4 UNION ALL
SELECT 1, 23.00, 23.00, 13, 5 UNION ALL
SELECT 2, 24.00, 48.00, 14, 5 UNION ALL
SELECT 1, 25.00, 25.00, 15, 5 UNION ALL
SELECT 1, 26.00, 26.00, 16, 6 UNION ALL
SELECT 2, 27.00, 54.00, 17, 6 UNION ALL
SELECT 1, 28.00, 28.00, 18, 6 UNION ALL
SELECT 1, 29.00, 29.00, 19, 7 UNION ALL
SELECT 2, 30.00, 60.00, 20, 7 UNION ALL
SELECT 1, 31.00, 31.00, 21, 7 UNION ALL
SELECT 1, 32.00, 32.00, 22, 8 UNION ALL
SELECT 2, 33.00, 66.00, 23, 8 UNION ALL
SELECT 1, 34.00, 34.00, 24, 8 UNION ALL
SELECT 1, 35.00, 35.00, 25, 9 UNION ALL
SELECT 2, 36.00, 72.00, 26, 9 UNION ALL
SELECT 1, 37.00, 37.00, 27, 9 UNION ALL
SELECT 1, 38.00, 38.00, 28, 10 UNION ALL
SELECT 2, 39.00, 78.00, 29, 10 UNION ALL
SELECT 1, 40.00, 40.00, 30, 10 UNION ALL
SELECT 1, 41.00, 41.00, 31, 11 UNION ALL
SELECT 2, 42.00, 84.00, 32, 11 UNION ALL
SELECT 1, 43.00, 43.00, 33, 11 UNION ALL
SELECT 1, 44.00, 44.00, 34, 12 UNION ALL
SELECT 2, 45.00, 90.00, 35, 12 UNION ALL
SELECT 1, 46.00, 46.00, 36, 12 UNION ALL
SELECT 1, 47.00, 47.00, 37, 13 UNION ALL
SELECT 2, 48.00, 96.00, 38, 13 UNION ALL
SELECT 1, 49.00, 49.00, 39, 13 UNION ALL
SELECT 1, 50.00, 50.00, 40, 14 UNION ALL
SELECT 2, 51.00, 102.00, 41, 14 UNION ALL
SELECT 1, 52.00, 52.00, 42, 14 UNION ALL
SELECT 1, 53.00, 53.00, 43, 15 UNION ALL
SELECT 2, 54.00, 108.00, 44, 15 UNION ALL
SELECT 1, 55.00, 55.00, 45, 15 UNION ALL
SELECT 1, 56.00, 56.00, 46, 16 UNION ALL
SELECT 2, 57.00, 114.00, 47, 16 UNION ALL
SELECT 1, 58.00, 58.00, 48, 16 UNION ALL
SELECT 1, 59.00, 59.00, 49, 17 UNION ALL
SELECT 2, 60.00, 120.00, 50, 17 UNION ALL
SELECT 1, 11.00, 11.00, 1, 17 UNION ALL
SELECT 1, 12.00, 12.00, 2, 18 UNION ALL
SELECT 2, 13.00, 26.00, 3, 18 UNION ALL
SELECT 1, 14.00, 14.00, 4, 18 UNION ALL
SELECT 1, 15.00, 15.00, 5, 19 UNION ALL
SELECT 2, 16.00, 32.00, 6, 19 UNION ALL
SELECT 1, 17.00, 17.00, 7, 19 UNION ALL
SELECT 1, 18.00, 18.00, 8, 20 UNION ALL
SELECT 2, 19.00, 38.00, 9, 20 UNION ALL
SELECT 1, 20.00, 20.00, 10, 20
WHERE NOT EXISTS (SELECT 1 FROM tb_itens_venda WHERE ven_id = 1);

-- Atualizar total das vendas para somar os subtotais
UPDATE tb_vendas v
SET v.total = (
  SELECT IFNULL(SUM(it.subtotal),0) FROM tb_itens_venda it WHERE it.ven_id = v.id
)
WHERE EXISTS (SELECT 1 FROM tb_itens_venda WHERE ven_id = v.id);

-- Inserir 50 movimentações de estoque
INSERT INTO tb_movimentacoes_estoque (tipo, quantidade, data_movimento, observacao, fun_id, pro_id)
SELECT 'ENTRADA', 10, NOW(), 'Entrada inicial', 1, 1 UNION ALL
SELECT 'ENTRADA', 5, NOW(), 'Entrada inicial', 2, 2 UNION ALL
SELECT 'ENTRADA', 8, NOW(), 'Entrada inicial', 3, 3 UNION ALL
SELECT 'SAIDA', 2, NOW(), 'Saída teste', 4, 4 UNION ALL
SELECT 'SAIDA', 1, NOW(), 'Saída teste', 5, 5 UNION ALL
SELECT 'ENTRADA', 12, NOW(), 'Entrada inicial', 6, 6 UNION ALL
SELECT 'SAIDA', 3, NOW(), 'Saída teste', 7, 7 UNION ALL
SELECT 'ENTRADA', 6, NOW(), 'Entrada inicial', 8, 8 UNION ALL
SELECT 'ENTRADA', 9, NOW(), 'Entrada inicial', 9, 9 UNION ALL
SELECT 'SAIDA', 4, NOW(), 'Saída teste', 10, 10 UNION ALL
SELECT 'ENTRADA', 7, NOW(), 'Entrada inicial', 11, 11 UNION ALL
SELECT 'ENTRADA', 2, NOW(), 'Entrada inicial', 12, 12 UNION ALL
SELECT 'SAIDA', 5, NOW(), 'Saída teste', 13, 13 UNION ALL
SELECT 'ENTRADA', 11, NOW(), 'Entrada inicial', 14, 14 UNION ALL
SELECT 'ENTRADA', 3, NOW(), 'Entrada inicial', 15, 15 UNION ALL
SELECT 'SAIDA', 6, NOW(), 'Saída teste', 16, 16 UNION ALL
SELECT 'ENTRADA', 4, NOW(), 'Entrada inicial', 17, 17 UNION ALL
SELECT 'ENTRADA', 8, NOW(), 'Entrada inicial', 18, 18 UNION ALL
SELECT 'SAIDA', 2, NOW(), 'Saída teste', 19, 19 UNION ALL
SELECT 'ENTRADA', 5, NOW(), 'Entrada inicial', 20, 20 UNION ALL
SELECT 'ENTRADA', 3, NOW(), 'Entrada inicial', 21, 21 UNION ALL
SELECT 'SAIDA', 1, NOW(), 'Saída teste', 22, 22 UNION ALL
SELECT 'ENTRADA', 2, NOW(), 'Entrada inicial', 23, 23 UNION ALL
SELECT 'ENTRADA', 6, NOW(), 'Entrada inicial', 24, 24 UNION ALL
SELECT 'SAIDA', 2, NOW(), 'Saída teste', 25, 25 UNION ALL
SELECT 'ENTRADA', 4, NOW(), 'Entrada inicial', 1, 26 UNION ALL
SELECT 'ENTRADA', 5, NOW(), 'Entrada inicial', 2, 27 UNION ALL
SELECT 'SAIDA', 3, NOW(), 'Saída teste', 3, 28 UNION ALL
SELECT 'ENTRADA', 6, NOW(), 'Entrada inicial', 4, 29 UNION ALL
SELECT 'ENTRADA', 7, NOW(), 'Entrada inicial', 5, 30 UNION ALL
SELECT 'SAIDA', 2, NOW(), 'Saída teste', 6, 31 UNION ALL
SELECT 'ENTRADA', 8, NOW(), 'Entrada inicial', 7, 32 UNION ALL
SELECT 'ENTRADA', 9, NOW(), 'Entrada inicial', 8, 33 UNION ALL
SELECT 'SAIDA', 1, NOW(), 'Saída teste', 9, 34 UNION ALL
SELECT 'ENTRADA', 3, NOW(), 'Entrada inicial', 10, 35 UNION ALL
SELECT 'ENTRADA', 4, NOW(), 'Entrada inicial', 11, 36 UNION ALL
SELECT 'SAIDA', 2, NOW(), 'Saída teste', 12, 37 UNION ALL
SELECT 'ENTRADA', 5, NOW(), 'Entrada inicial', 13, 38 UNION ALL
SELECT 'ENTRADA', 6, NOW(), 'Entrada inicial', 14, 39 UNION ALL
SELECT 'SAIDA', 3, NOW(), 'Saída teste', 15, 40 UNION ALL
SELECT 'ENTRADA', 4, NOW(), 'Entrada inicial', 16, 41 UNION ALL
SELECT 'ENTRADA', 2, NOW(), 'Entrada inicial', 17, 42 UNION ALL
SELECT 'SAIDA', 1, NOW(), 'Saída teste', 18, 43 UNION ALL
SELECT 'ENTRADA', 5, NOW(), 'Entrada inicial', 19, 44 UNION ALL
SELECT 'ENTRADA', 3, NOW(), 'Entrada inicial', 20, 45 UNION ALL
SELECT 'SAIDA', 2, NOW(), 'Saída teste', 21, 46 UNION ALL
SELECT 'ENTRADA', 1, NOW(), 'Entrada inicial', 22, 47 UNION ALL
SELECT 'ENTRADA', 4, NOW(), 'Entrada inicial', 23, 48 UNION ALL
SELECT 'SAIDA', 2, NOW(), 'Saída teste', 24, 49 UNION ALL
SELECT 'ENTRADA', 3, NOW(), 'Entrada inicial', 25, 50
WHERE NOT EXISTS (SELECT 1 FROM tb_movimentacoes_estoque LIMIT 1);

-- Fim do script
