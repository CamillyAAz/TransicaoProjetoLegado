#!/usr/bin/env python
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'projeto.settings')
django.setup()

from clientes.models import Cliente
from fornecedores.models import Fornecedor
from produtos.models import Produto
from vendas.models import Venda, ItemVenda
from django.utils import timezone

def create_sample_data():
    print('Criando dados de exemplo...')
    
    # Criar Clientes
    cliente1 = Cliente.objects.create(
        nome='João Silva',
        cpf='12345678901',
        email='joao@email.com',
        telefone='11999999999',
        celular='11988888888',
        cep='01310100',
        endereco='Avenida Paulista',
        numero=1000,
        complemento='Apto 101',
        bairro='Bela Vista',
        cidade='São Paulo',
        estado='SP'
    )
    
    cliente2 = Cliente.objects.create(
        nome='Maria Santos',
        cpf='98765432109',
        email='maria@email.com',
        telefone='1177777777',
        celular='1166666666',
        cep='04547000',
        endereco='Rua Augusta',
        numero=2000,
        bairro='Jardins',
        cidade='São Paulo',
        estado='SP'
    )
    
    # Criar Fornecedores
    fornecedor1 = Fornecedor.objects.create(
        nome='Tech Supply Ltda',
        cnpj='12345678000195',
        email='contato@techsupply.com.br',
        telefone='1133333333',
        celular='1144444444',
        cep='04547000',
        endereco='Rua dos Tecnológicos',
        numero=500,
        bairro='Vila Olímpia',
        cidade='São Paulo',
        estado='SP'
    )
    
    fornecedor2 = Fornecedor.objects.create(
        nome='Comercial Eletrônicos',
        cnpj='98765432000158',
        email='vendas@comeletro.com.br',
        telefone='1122222222',
        celular='1111111111',
        cep='01310100',
        endereco='Avenida dos Negócios',
        numero=800,
        bairro='Centro',
        cidade='São Paulo',
        estado='SP'
    )
    
    # Criar Produtos
    produto1 = Produto.objects.create(
        nome='Notebook Dell Inspiron',
        descricao='Notebook Dell Inspiron 15, Intel Core i5, 8GB RAM, 256GB SSD',
        preco='3500.00',
        qtd_estoque=10,
        fornecedor_id=fornecedor1.id
    )
    
    produto2 = Produto.objects.create(
        nome='Mouse Wireless Logitech',
        descricao='Mouse wireless com receptor USB, bateria inclusa',
        preco='89.90',
        qtd_estoque=50,
        fornecedor_id=fornecedor1.id
    )
    
    produto3 = Produto.objects.create(
        nome='Teclado Mecânico RGB',
        descricao='Teclado mecânico com iluminação RGB, switches azuis',
        preco='299.90',
        qtd_estoque=25,
        fornecedor_id=fornecedor2.id
    )
    
    print('✅ Dados criados com sucesso!')
    print('📊 Resumo:')
    print(f'  - Clientes: {Cliente.objects.count()}')
    print(f'  - Fornecedores: {Fornecedor.objects.count()}')
    print(f'  - Produtos: {Produto.objects.count()}')
    print(f'  - Vendas: {Venda.objects.count()}')

if __name__ == '__main__':
    create_sample_data()