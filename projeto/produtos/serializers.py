from rest_framework import serializers
from .models import Fornecedor, Produto, MovimentacaoEstoque


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


class MovimentacaoEstoqueSerializer(serializers.ModelSerializer):
    produto_descricao = serializers.CharField(source='produto.descricao', read_only=True)
    funcionario = serializers.PrimaryKeyRelatedField(read_only=True)
    data_movimento = serializers.DateTimeField(read_only=True)

    class Meta:
        model = MovimentacaoEstoque
        fields = [
            'id', 'produto', 'produto_descricao', 'tipo', 'quantidade',
            'data_movimento', 'funcionario', 'observacao'
        ]

    def validate_tipo(self, value):
        if value not in ('ENTRADA', 'SAIDA'):
            raise serializers.ValidationError('Tipo deve ser ENTRADA ou SAIDA.')
        return value

    def validate_quantidade(self, value):
        if value <= 0:
            raise serializers.ValidationError('Quantidade deve ser maior que zero.')
        return value

    def validate(self, attrs):
        produto = attrs.get('produto')
        tipo = attrs.get('tipo')
        quantidade = attrs.get('quantidade')

        if produto and tipo == 'SAIDA' and quantidade:
            if produto.qtd_estoque < quantidade:
                raise serializers.ValidationError({'quantidade': 'Estoque insuficiente para saída.'})
        return attrs
    
    def validate_qtd_estoque(self, value):
        if value < 0:
            raise serializers.ValidationError("A quantidade em estoque não pode ser negativa.")
        return value
