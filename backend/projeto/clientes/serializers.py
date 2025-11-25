from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Cliente


class ClienteSerializer(serializers.ModelSerializer):
    # Accept plain-text senha on write, but never return it in responses
    senha = serializers.CharField(write_only=True, required=False, allow_null=True, allow_blank=True, min_length=6)

    class Meta:
        model = Cliente
        # hide senha from read responses
        fields = [
            'id', 'nome', 'rg', 'cpf', 'email', 'telefone', 'celular', 'cep', 'endereco',
            'numero', 'complemento', 'bairro', 'cidade', 'estado', 'senha'
        ]

    def create(self, validated_data):
        senha = validated_data.pop('senha', None)
        if senha:
            validated_data['senha'] = make_password(senha)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        senha = validated_data.pop('senha', None)
        if senha:
            instance.senha = make_password(senha)
        return super().update(instance, validated_data)
