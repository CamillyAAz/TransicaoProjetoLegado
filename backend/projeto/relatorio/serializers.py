from rest_framework import serializers
from vendas.models import Venda, ItemVenda
from produtos.models import Produto, MovimentacaoEstoque
from clientes.models import Cliente
from fornecedores.models import Fornecedor


class RelatorioGeralSerializer(serializers.Serializer):
    """Serializer para o relatório geral do sistema"""
    
    # Estatísticas gerais
    total_vendas = serializers.IntegerField(read_only=True)
    valor_total_vendas = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_clientes = serializers.IntegerField(read_only=True)
    total_produtos = serializers.IntegerField(read_only=True)
    total_fornecedores = serializers.IntegerField(read_only=True)
    
    # Dados detalhados
    vendas_recentes = serializers.ListField(read_only=True)
    produtos_estoque_baixo = serializers.ListField(read_only=True)
    clientes_mais_compradores = serializers.ListField(read_only=True)
    produtos_mais_vendidos = serializers.ListField(read_only=True)
    fornecedores_ativos = serializers.ListField(read_only=True)
