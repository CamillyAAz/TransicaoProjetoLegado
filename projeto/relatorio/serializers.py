from rest_framework import serializers
from .models import RelatorioVendas

class RelatorioVendasSerializer(serializers.ModelSerializer):
    class Meta:
        model = RelatorioVendas
        fields = ['id', 'venda', 'fornecedor', 'cliente', 'produto', 'data_geracao']