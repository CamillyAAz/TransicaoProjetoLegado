from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Funcionario


@admin.register(Funcionario)
class FuncionarioAdmin(UserAdmin):
    list_display = ('id', 'nome', 'email', 'cargo', 'nivel_acesso', 'is_active', 'is_staff')
    list_filter = ('is_active', 'is_staff', 'cargo', 'nivel_acesso')
    search_fields = ('nome', 'email', 'cpf')
    ordering = ('nome',)
    
    fieldsets = (
        ('Informações de Autenticação', {
            'fields': ('email', 'password')
        }),
        ('Informações Pessoais', {
            'fields': ('nome', 'rg', 'cpf')
        }),
        ('Informações Profissionais', {
            'fields': ('cargo', 'nivel_acesso')
        }),
        ('Contato', {
            'fields': ('telefone', 'celular')
        }),
        ('Endereço', {
            'fields': ('cep', 'endereco', 'numero', 'complemento', 'bairro', 'cidade', 'estado')
        }),
        ('Permissões', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nome', 'password1', 'password2', 'cargo', 'nivel_acesso'),
        }),
    )
