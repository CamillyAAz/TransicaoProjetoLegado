from django.db import models
from django.conf import settings


class Fornecedor(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=100)
    cnpj = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(max_length=200, blank=True, null=True)
    telefone = models.CharField(max_length=30, blank=True, null=True)
    celular = models.CharField(max_length=30, blank=True, null=True)
    cep = models.CharField(max_length=100, blank=True, null=True)
    endereco = models.CharField(max_length=255, blank=True, null=True)
    numero = models.IntegerField(blank=True, null=True)
    complemento = models.CharField(max_length=20, blank=True, null=True)
    bairro = models.CharField(max_length=100, blank=True, null=True)
    cidade = models.CharField(max_length=100, blank=True, null=True)
    estado = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        db_table = 'tb_fornecedores'
        managed = True

    def __str__(self):
        return self.nome


class Produto(models.Model):
    id = models.AutoField(primary_key=True)
    descricao = models.CharField(max_length=100)
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    qtd_estoque = models.IntegerField()
    fornecedor = models.ForeignKey(
        Fornecedor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column='for_id',
        related_name='produtos'
    )

    class Meta:
        db_table = 'tb_produtos'
        managed = True

    def __str__(self):
        return self.descricao


class MovimentacaoEstoque(models.Model): # ENTIDADE QUE CONTROLA ENTRADAS E SAIDAS
    TIPOS = (                            # TIPOS DE MOVIMENTACAO
        ('ENTRADA', 'Entrada'), 
        ('SAIDA', 'Saída'),
    )

    id = models.AutoField(primary_key=True)   # DEFINE A PK
    produto = models.ForeignKey(              # RELACIONA A MOVIMENTACAO AO PRODUTO
        Produto,
        on_delete=models.CASCADE,             # SE O PRODUTO FOR DELETADO A MOVIMENTACAO TBM É
        db_column='pro_id',                   
        related_name='movimentacoes'
    )
    tipo = models.CharField(max_length=8, choices=TIPOS) # ARMAZENA O TIPO
    quantidade = models.PositiveIntegerField()           # QUANTIDADE MOVIMENTADA, SÓ POSITIVO
    data_movimento = models.DateTimeField(auto_now_add=True) # SALVA A DATA E HORA ATUAL
    funcionario = models.ForeignKey(                         # RELACIONA O FUNCIONARIO
        settings.AUTH_USER_MODEL,                            
        on_delete=models.SET_NULL,                            
        null=True,
        db_column='fun_id',
        related_name='movimentacoes_estoque'
    )
    observacao = models.CharField(max_length=255, blank=True, null=True) 

    class Meta:                                          # DEFINE A TABELA
        db_table = 'tb_movimentacoes_estoque'
        managed = True

    def __str__(self):                                   # REPRESENTACAO PARA LOGS
        return f"{self.tipo} {self.quantidade} - {self.produto.descricao}"