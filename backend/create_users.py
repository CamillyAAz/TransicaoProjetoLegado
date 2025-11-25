#!/usr/bin/env python
"""Script para criar usuários de teste com diferentes níveis de acesso"""

from accounts.models import Funcionario

# Definir os usuários a serem criados
usuarios = [
    {
        'email': 'admin@admin.com',
        'password': 'admin123',
        'nome': 'Administrador',
        'nivel_acesso': 'admin',
        'cargo': 'Administrador',
        'is_staff': True,
        'is_superuser': True
    },
    {
        'email': 'gerente@sistema.com',
        'password': 'gerente123',
        'nome': 'João Gerente',
        'nivel_acesso': 'gerente',
        'cargo': 'Gerente',
        'is_staff': True,
        'is_superuser': False
    },
    {
        'email': 'vendedor@sistema.com',
        'password': 'vendedor123',
        'nome': 'Maria Vendedora',
        'nivel_acesso': 'vendedor',
        'cargo': 'Vendedor',
        'is_staff': False,
        'is_superuser': False
    },
    {
        'email': 'operador@sistema.com',
        'password': 'operador123',
        'nome': 'Carlos Operador',
        'nivel_acesso': 'operador',
        'cargo': 'Operador',
        'is_staff': False,
        'is_superuser': False
    },
    {
        'email': 'caixa@sistema.com',
        'password': 'caixa123',
        'nome': 'Ana Caixa',
        'nivel_acesso': 'caixa',
        'cargo': 'Operador de Caixa',
        'is_staff': False,
        'is_superuser': False
    }
]

print("Criando usuários...")
print("-" * 60)

for usuario_data in usuarios:
    email = usuario_data['email']
    password = usuario_data.pop('password')
    
    # Verificar se o usuário já existe
    if Funcionario.objects.filter(email=email).exists():
        print(f"✓ Usuário {email} já existe. Pulando...")
        continue
    
    # Criar o usuário
    try:
        usuario = Funcionario.objects.create_user(
            email=email,
            password=password,
            **usuario_data
        )
        print(f"✓ Criado: {usuario.nome} ({email}) - Nível: {usuario.nivel_acesso}")
    except Exception as e:
        print(f"✗ Erro ao criar {email}: {str(e)}")

print("-" * 60)
print("Processo concluído!")
print("\nCredenciais de acesso:")
print("-" * 60)
print("Admin:     admin@admin.com / admin123")
print("Gerente:   gerente@sistema.com / gerente123")
print("Vendedor:  vendedor@sistema.com / vendedor123")
print("Operador:  operador@sistema.com / operador123")
print("Caixa:     caixa@sistema.com / caixa123")
print("-" * 60)
