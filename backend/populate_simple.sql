USE bdvendas;

-- Inserir 50 produtos (se ainda não existem)
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

-- Inserir 40 vendas (usando IDs reais: clientes 4-28, funcionários 19-43)
INSERT INTO tb_vendas (data_venda, total, observacao, cli_id, fun_id)
SELECT NOW(), 0.00, 'Venda teste 1', 4, 19 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 2', 5, 20 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 3', 6, 21 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 4', 7, 22 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 5', 8, 23 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 6', 9, 24 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 7', 10, 25 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 8', 11, 26 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 9', 12, 27 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 10', 13, 28 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 11', 14, 29 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 12', 15, 30 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 13', 16, 31 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 14', 17, 32 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 15', 18, 33 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 16', 19, 34 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 17', 20, 35 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 18', 21, 36 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 19', 22, 37 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 20', 23, 38 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 21', 24, 39 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 22', 25, 40 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 23', 26, 41 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 24', 27, 42 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 25', 28, 43 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 26', 4, 19 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 27', 5, 20 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 28', 6, 21 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 29', 7, 22 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 30', 8, 23 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 31', 9, 24 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 32', 10, 25 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 33', 11, 26 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 34', 12, 27 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 35', 13, 28 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 36', 14, 29 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 37', 15, 30 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 38', 16, 31 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 39', 17, 32 UNION ALL
SELECT NOW(), 0.00, 'Venda teste 40', 18, 33
WHERE NOT EXISTS (SELECT 1 FROM tb_vendas WHERE observacao = 'Venda teste 1');

-- Inserir itens de venda (60 itens para 20 vendas, 3 itens cada)
-- Referenciando as VENDAs por IDs 1-20 (ou quantas forem inseridas)
INSERT INTO tb_itens_venda (quantidade, preco_unitario, subtotal, pro_id, ven_id)
SELECT 2, 11.00, 22.00, 1, (SELECT MIN(id) FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 12.00, 12.00, 2, (SELECT MIN(id) FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 3, 13.00, 39.00, 3, (SELECT MIN(id) FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 14.00, 14.00, 4, (SELECT MIN(id)+1 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 2, 15.00, 30.00, 5, (SELECT MIN(id)+1 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 16.00, 16.00, 6, (SELECT MIN(id)+1 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 17.00, 17.00, 7, (SELECT MIN(id)+2 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 2, 18.00, 36.00, 8, (SELECT MIN(id)+2 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 19.00, 19.00, 9, (SELECT MIN(id)+2 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 20.00, 20.00, 10, (SELECT MIN(id)+3 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 2, 21.00, 42.00, 11, (SELECT MIN(id)+3 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 22.00, 22.00, 12, (SELECT MIN(id)+3 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 23.00, 23.00, 13, (SELECT MIN(id)+4 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 2, 24.00, 48.00, 14, (SELECT MIN(id)+4 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 25.00, 25.00, 15, (SELECT MIN(id)+4 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 26.00, 26.00, 16, (SELECT MIN(id)+5 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 2, 27.00, 54.00, 17, (SELECT MIN(id)+5 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 28.00, 28.00, 18, (SELECT MIN(id)+5 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 29.00, 29.00, 19, (SELECT MIN(id)+6 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 2, 30.00, 60.00, 20, (SELECT MIN(id)+6 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 31.00, 31.00, 21, (SELECT MIN(id)+6 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 32.00, 32.00, 22, (SELECT MIN(id)+7 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 2, 33.00, 66.00, 23, (SELECT MIN(id)+7 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 34.00, 34.00, 24, (SELECT MIN(id)+7 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 35.00, 35.00, 25, (SELECT MIN(id)+8 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 2, 36.00, 72.00, 26, (SELECT MIN(id)+8 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 37.00, 37.00, 27, (SELECT MIN(id)+8 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 38.00, 38.00, 28, (SELECT MIN(id)+9 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 2, 39.00, 78.00, 29, (SELECT MIN(id)+9 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 40.00, 40.00, 30, (SELECT MIN(id)+9 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 41.00, 41.00, 31, (SELECT MIN(id)+10 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 2, 42.00, 84.00, 32, (SELECT MIN(id)+10 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 43.00, 43.00, 33, (SELECT MIN(id)+10 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 44.00, 44.00, 34, (SELECT MIN(id)+11 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 2, 45.00, 90.00, 35, (SELECT MIN(id)+11 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 46.00, 46.00, 36, (SELECT MIN(id)+11 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 47.00, 47.00, 37, (SELECT MIN(id)+12 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 2, 48.00, 96.00, 38, (SELECT MIN(id)+12 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 49.00, 49.00, 39, (SELECT MIN(id)+12 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 50.00, 50.00, 40, (SELECT MIN(id)+13 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 2, 51.00, 102.00, 41, (SELECT MIN(id)+13 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 52.00, 52.00, 42, (SELECT MIN(id)+13 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 53.00, 53.00, 43, (SELECT MIN(id)+14 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 2, 54.00, 108.00, 44, (SELECT MIN(id)+14 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 55.00, 55.00, 45, (SELECT MIN(id)+14 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 56.00, 56.00, 46, (SELECT MIN(id)+15 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 2, 57.00, 114.00, 47, (SELECT MIN(id)+15 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 58.00, 58.00, 48, (SELECT MIN(id)+15 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 59.00, 59.00, 49, (SELECT MIN(id)+16 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 2, 60.00, 120.00, 50, (SELECT MIN(id)+16 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 11.00, 11.00, 1, (SELECT MIN(id)+16 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 12.00, 12.00, 2, (SELECT MIN(id)+17 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 2, 13.00, 26.00, 3, (SELECT MIN(id)+17 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 14.00, 14.00, 4, (SELECT MIN(id)+17 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 15.00, 15.00, 5, (SELECT MIN(id)+18 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 2, 16.00, 32.00, 6, (SELECT MIN(id)+18 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 17.00, 17.00, 7, (SELECT MIN(id)+18 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 18.00, 18.00, 8, (SELECT MIN(id)+19 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 2, 19.00, 38.00, 9, (SELECT MIN(id)+19 FROM tb_vendas WHERE observacao = 'Venda teste 1') UNION ALL
SELECT 1, 20.00, 20.00, 10, (SELECT MIN(id)+19 FROM tb_vendas WHERE observacao = 'Venda teste 1')
WHERE NOT EXISTS (SELECT 1 FROM tb_itens_venda WHERE ven_id = (SELECT MIN(id) FROM tb_vendas WHERE observacao = 'Venda teste 1'));

-- Atualizar total das vendas
UPDATE tb_vendas v
SET v.total = (
  SELECT IFNULL(SUM(it.subtotal),0) FROM tb_itens_venda it WHERE it.ven_id = v.id
)
WHERE EXISTS (SELECT 1 FROM tb_itens_venda WHERE ven_id = v.id);

-- Inserir 50 movimentações de estoque (usando IDs 19-43 de funcionários, 1-50 de produtos)
INSERT INTO tb_movimentacoes_estoque (tipo, quantidade, data_movimento, observacao, fun_id, pro_id)
SELECT 'ENTRADA', 10, NOW(), 'Entrada inicial', 19, 1 UNION ALL
SELECT 'ENTRADA', 5, NOW(), 'Entrada inicial', 20, 2 UNION ALL
SELECT 'ENTRADA', 8, NOW(), 'Entrada inicial', 21, 3 UNION ALL
SELECT 'SAIDA', 2, NOW(), 'Saída teste', 22, 4 UNION ALL
SELECT 'SAIDA', 1, NOW(), 'Saída teste', 23, 5 UNION ALL
SELECT 'ENTRADA', 12, NOW(), 'Entrada inicial', 24, 6 UNION ALL
SELECT 'SAIDA', 3, NOW(), 'Saída teste', 25, 7 UNION ALL
SELECT 'ENTRADA', 6, NOW(), 'Entrada inicial', 26, 8 UNION ALL
SELECT 'ENTRADA', 9, NOW(), 'Entrada inicial', 27, 9 UNION ALL
SELECT 'SAIDA', 4, NOW(), 'Saída teste', 28, 10 UNION ALL
SELECT 'ENTRADA', 7, NOW(), 'Entrada inicial', 29, 11 UNION ALL
SELECT 'ENTRADA', 2, NOW(), 'Entrada inicial', 30, 12 UNION ALL
SELECT 'SAIDA', 5, NOW(), 'Saída teste', 31, 13 UNION ALL
SELECT 'ENTRADA', 11, NOW(), 'Entrada inicial', 32, 14 UNION ALL
SELECT 'ENTRADA', 3, NOW(), 'Entrada inicial', 33, 15 UNION ALL
SELECT 'SAIDA', 6, NOW(), 'Saída teste', 34, 16 UNION ALL
SELECT 'ENTRADA', 4, NOW(), 'Entrada inicial', 35, 17 UNION ALL
SELECT 'ENTRADA', 8, NOW(), 'Entrada inicial', 36, 18 UNION ALL
SELECT 'SAIDA', 2, NOW(), 'Saída teste', 37, 19 UNION ALL
SELECT 'ENTRADA', 5, NOW(), 'Entrada inicial', 38, 20 UNION ALL
SELECT 'ENTRADA', 3, NOW(), 'Entrada inicial', 39, 21 UNION ALL
SELECT 'SAIDA', 1, NOW(), 'Saída teste', 40, 22 UNION ALL
SELECT 'ENTRADA', 2, NOW(), 'Entrada inicial', 41, 23 UNION ALL
SELECT 'ENTRADA', 6, NOW(), 'Entrada inicial', 42, 24 UNION ALL
SELECT 'SAIDA', 2, NOW(), 'Saída teste', 43, 25 UNION ALL
SELECT 'ENTRADA', 4, NOW(), 'Entrada inicial', 19, 26 UNION ALL
SELECT 'ENTRADA', 5, NOW(), 'Entrada inicial', 20, 27 UNION ALL
SELECT 'SAIDA', 3, NOW(), 'Saída teste', 21, 28 UNION ALL
SELECT 'ENTRADA', 6, NOW(), 'Entrada inicial', 22, 29 UNION ALL
SELECT 'ENTRADA', 7, NOW(), 'Entrada inicial', 23, 30 UNION ALL
SELECT 'SAIDA', 2, NOW(), 'Saída teste', 24, 31 UNION ALL
SELECT 'ENTRADA', 8, NOW(), 'Entrada inicial', 25, 32 UNION ALL
SELECT 'ENTRADA', 9, NOW(), 'Entrada inicial', 26, 33 UNION ALL
SELECT 'SAIDA', 1, NOW(), 'Saída teste', 27, 34 UNION ALL
SELECT 'ENTRADA', 3, NOW(), 'Entrada inicial', 28, 35 UNION ALL
SELECT 'ENTRADA', 4, NOW(), 'Entrada inicial', 29, 36 UNION ALL
SELECT 'SAIDA', 2, NOW(), 'Saída teste', 30, 37 UNION ALL
SELECT 'ENTRADA', 5, NOW(), 'Entrada inicial', 31, 38 UNION ALL
SELECT 'ENTRADA', 6, NOW(), 'Entrada inicial', 32, 39 UNION ALL
SELECT 'SAIDA', 3, NOW(), 'Saída teste', 33, 40 UNION ALL
SELECT 'ENTRADA', 4, NOW(), 'Entrada inicial', 34, 41 UNION ALL
SELECT 'ENTRADA', 2, NOW(), 'Entrada inicial', 35, 42 UNION ALL
SELECT 'SAIDA', 1, NOW(), 'Saída teste', 36, 43 UNION ALL
SELECT 'ENTRADA', 5, NOW(), 'Entrada inicial', 37, 44 UNION ALL
SELECT 'ENTRADA', 3, NOW(), 'Entrada inicial', 38, 45 UNION ALL
SELECT 'SAIDA', 2, NOW(), 'Saída teste', 39, 46 UNION ALL
SELECT 'ENTRADA', 1, NOW(), 'Entrada inicial', 40, 47 UNION ALL
SELECT 'ENTRADA', 4, NOW(), 'Entrada inicial', 41, 48 UNION ALL
SELECT 'SAIDA', 2, NOW(), 'Saída teste', 42, 49 UNION ALL
SELECT 'ENTRADA', 3, NOW(), 'Entrada inicial', 43, 50
WHERE NOT EXISTS (SELECT 1 FROM tb_movimentacoes_estoque WHERE pro_id = 1);

-- Fim do script
