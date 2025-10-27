from rest_framework import serializers
from .models import Fornecedor, Produto


class FornecedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fornecedor
        fields = '__all__'


class ProdutoSerializer(serializers.ModelSerializer):
    fornecedor_nome = serializers.CharField(source='fornecedor.nome', read_only=True)
    
    class Meta:
        model = Produto
        fields = ['id', 'descricao', 'preco', 'qtd_estoque', 'fornecedor', 'fornecedor_nome']
        
    def validate_preco(self, value):
        if value < 0:
            raise serializers.ValidationError("O preço não pode ser negativo.")
        return value
    
    def validate_qtd_estoque(self, value):
        if value < 0:
            raise serializers.ValidationError("A quantidade em estoque não pode ser negativa.")
        return value
