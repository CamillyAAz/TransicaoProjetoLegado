from rest_framework import serializers
from clientes.models import Cliente


class ConsultaClienteSerializer(serializers.ModelSerializer):
    """
    Serializer para consulta de clientes com campos específicos para exibição
    """
    class Meta:
        model = Cliente
        fields = [
            'id',
            'nome',
            'cpf',
            'email',
            'telefone',
            'celular',
            'cidade',
            'estado'
        ]
        read_only_fields = ['id']


class ConsultaClienteDetalhadaSerializer(serializers.ModelSerializer):
    """
    Serializer para consulta detalhada de clientes com todos os campos
    """
    class Meta:
        model = Cliente
        fields = '__all__'
        read_only_fields = ['id']
