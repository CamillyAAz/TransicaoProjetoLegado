from django.db import models
from vendas.models import Venda
from fornecedores.models import Fornecedor
from clientes.models import Cliente
from produtos.models import Produto

class RelatorioVendas(models.Model):
    venda = models.ForeignKey(Venda, on_delete=models.CASCADE)
    fornecedor = models.ForeignKey(Fornecedor, on_delete=models.CASCADE)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    data_geracao = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-data_geracao']