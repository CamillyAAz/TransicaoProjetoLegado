from rest_framework import serializers
from .models import Funcionario

class FuncionarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Funcionario
        fields = ['id', 'nome', 'email', 'cpf', 'cargo', 'nivel_acesso', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        funcionario = Funcionario(**validated_data)
        funcionario.set_password(password)
        funcionario.save()
        return funcionario
