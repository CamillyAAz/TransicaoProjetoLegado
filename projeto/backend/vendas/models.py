from django.db import models
from clientes.models import Cliente
from accounts.models import Funcionario
from produtos.models import Produto


class Venda(models.Model):
    id = models.AutoField(primary_key=True)
    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.SET_NULL,
        null=True,
        db_column='cli_id',
        related_name='vendas'
    )
    funcionario = models.ForeignKey(
        Funcionario,
        on_delete=models.SET_NULL,
        null=True,
        db_column='fun_id',
        related_name='vendas'
    )
    data_venda = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    observacao = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'tb_vendas'
        managed = True

    def __str__(self):
        return f"Venda #{self.id} - Total: {self.total}"


class ItemVenda(models.Model):
    id = models.AutoField(primary_key=True)
    venda = models.ForeignKey(
        Venda,
        on_delete=models.CASCADE,
        db_column='ven_id',
        related_name='itens'
    )
    produto = models.ForeignKey(
        Produto,
        on_delete=models.PROTECT,
        db_column='pro_id',
        related_name='itens_venda'
    )
    quantidade = models.PositiveIntegerField()
    preco_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'tb_itens_venda'
        managed = True

    def __str__(self):
        return f"{self.produto.descricao} x{self.quantidade}"