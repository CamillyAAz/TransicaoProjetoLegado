from rest_framework import serializers
from .models import Funcionario


class FuncionarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    is_admin = serializers.BooleanField(write_only=True, required=False, default=False, help_text="Se True, o usuário será admin (staff + superuser)")
    
    class Meta:
        model = Funcionario
        fields = [
            'id', 'nome', 'rg', 'cpf', 'email', 'password',
            'cargo', 'nivel_acesso', 'telefone', 'celular', 'cep', 'endereco',
            'numero', 'complemento', 'bairro', 'cidade', 'estado',
            'ui_permissoes', 'is_active', 'is_staff', 'is_superuser', 'is_admin'
        ]
        read_only_fields = ['id', 'is_superuser']
        extra_kwargs = {
            'nome': {'required': True},
            'email': {'required': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        is_admin = validated_data.pop('is_admin', False)
        
        funcionario = Funcionario(**validated_data)
        funcionario.set_password(password)
        
        # Se é admin, setar flags apropriadas
        if is_admin:
            funcionario.is_staff = True
            funcionario.is_superuser = True
        else:
            funcionario.is_staff = False
            funcionario.is_superuser = False
        
        funcionario.save()
        return funcionario
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        is_admin = validated_data.pop('is_admin', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Atualizar flags de admin/staff se is_admin foi fornecido
        if is_admin is not None:
            if is_admin:
                instance.is_staff = True
                instance.is_superuser = True
            else:
                instance.is_staff = False
                instance.is_superuser = False
        
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance
