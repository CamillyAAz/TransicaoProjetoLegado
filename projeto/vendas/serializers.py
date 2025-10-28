from rest_framework import serializers
from .models import Venda, ItemVenda
from produtos.models import Produto


class ItemVendaSerializer(serializers.ModelSerializer):
    produto_descricao = serializers.CharField(source='produto.descricao', read_only=True)

    class Meta:
        model = ItemVenda
        fields = ['produto', 'produto_descricao', 'quantidade', 'preco_unitario', 'subtotal']
        read_only_fields = ['preco_unitario', 'subtotal']

    def validate_quantidade(self, value):
        if value <= 0:
            raise serializers.ValidationError('Quantidade deve ser maior que zero.')
        return value


class VendaSerializer(serializers.ModelSerializer):
    itens = ItemVendaSerializer(many=True)
    data_venda = serializers.DateTimeField(read_only=True)
    funcionario = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Venda
        fields = ['id', 'cliente', 'funcionario', 'data_venda', 'observacao', 'total', 'itens']
        read_only_fields = ['total']

    def validate(self, attrs):
        itens = self.initial_data.get('itens') or []
        if not itens:
            raise serializers.ValidationError({'itens': 'A venda deve conter ao menos um item.'})
        # valida produtos existem
        for item in itens:
            produto_id = item.get('produto')
            quantidade = item.get('quantidade')
            if not produto_id or not quantidade:
                raise serializers.ValidationError({'itens': 'Cada item deve ter produto e quantidade.'})
            try:
                Produto.objects.get(id=produto_id)
            except Produto.DoesNotExist:
                raise serializers.ValidationError({'itens': f'Produto {produto_id} não encontrado.'})
        return attrs