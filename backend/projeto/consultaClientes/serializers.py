from rest_framework import serializers
from clientes.models import Cliente
from fornecedores.models import Fornecedor


class ClienteDetalhadoSerializer(serializers.ModelSerializer):
    """Serializer completo para dados do cliente"""
    
    total_compras = serializers.IntegerField(read_only=True, required=False)
    valor_total_compras = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        read_only=True, 
        required=False
    )
    
    class Meta:
        model = Cliente
        fields = [
            'id', 'nome', 'rg', 'cpf', 'email', 'telefone', 'celular',
            'cep', 'endereco', 'numero', 'complemento', 'bairro', 
            'cidade', 'estado', 'total_compras', 'valor_total_compras'
        ]


class FornecedorDetalhadoSerializer(serializers.ModelSerializer):
    """Serializer completo para dados do fornecedor"""
    
    total_produtos = serializers.IntegerField(read_only=True, required=False)
    produtos_ativos = serializers.IntegerField(read_only=True, required=False)
    
    class Meta:
        model = Fornecedor
        fields = [
            'id', 'nome', 'cnpj', 'email', 'telefone', 'celular', 
            'cep', 'endereco', 'numero', 'complemento', 'bairro', 
            'cidade', 'estado', 'total_produtos', 'produtos_ativos'
        ]


class ConsultaConsolidadaSerializer(serializers.Serializer):
    """Serializer para consulta consolidada de clientes e fornecedores"""
    
    total_clientes = serializers.IntegerField(read_only=True)
    total_fornecedores = serializers.IntegerField(read_only=True)
    clientes = ClienteDetalhadoSerializer(many=True, read_only=True)
    fornecedores = FornecedorDetalhadoSerializer(many=True, read_only=True)
