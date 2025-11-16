from rest_framework import serializers
from .models import Funcionario


class FuncionarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    
    class Meta:
        model = Funcionario
        fields = [
            'id', 'nome', 'rg', 'cpf', 'email', 'password',
            'cargo', 'nivel_acesso', 'telefone', 'celular', 'cep', 'endereco',
            'numero', 'complemento', 'bairro', 'cidade', 'estado', 
            'is_active', 'is_staff'
        ]
        read_only_fields = ['id']
        extra_kwargs = {
            'nome': {'required': True},
            'email': {'required': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        funcionario = Funcionario(**validated_data)
        funcionario.set_password(password)
        funcionario.save()
        return funcionario
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance
