#!/usr/bin/env python
import os
import django
import random
from decimal import Decimal

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'projeto.settings')
django.setup()

from clientes.models import Cliente
from fornecedores.models import Fornecedor as FornecedorProd
from produtos.models import Fornecedor, Produto, MovimentacaoEstoque
from vendas.models import Venda, ItemVenda
from accounts.models import Funcionario
from django.utils import timezone


def populate():
    print('Populando banco de dados com dados de teste...')

    # Criar Fornecedores (25)
    fornecedores = []
    for i in range(1, 26):
        f = Fornecedor.objects.create(
            nome=f'Fornecedor {i}',
            cnpj=str(10000000000000 + i),
            email=f'fornecedor{i}@exemplo.com',
            telefone=f'11{900000000 + i}',
            celular=f'11{910000000 + i}',
            cep='01001000',
            endereco=f'Rua Exemplo {i}',
            numero=i,
            bairro='Bairro Teste',
            cidade='Cidade',
            estado='SP'
        )
        fornecedores.append(f)

    # Criar Clientes (25)
    clientes = []
    for i in range(1, 26):
        c = Cliente.objects.create(
            nome=f'Cliente {i}',
            cpf=str(20000000000 + i),
            email=f'cliente{i}@exemplo.com',
            telefone=f'11{920000000 + i}',
            celular=f'11{930000000 + i}',
            cep='02002000',
            endereco=f'Avenida Cliente {i}',
            numero=i,
            bairro='Centro',
            cidade='Cidade',
            estado='SP'
        )
        clientes.append(c)

    # Criar Funcionários (25)
    funcionarios = []
    for i in range(1, 26):
        email = f'func{i}@example.com'
        u = Funcionario.objects.create_user(email=email, password='senha123', nome=f'Funcionario {i}')
        u.cargo = 'Vendedor'
        u.save()
        funcionarios.append(u)

    # Criar Produtos (50)
    produtos = []
    for i in range(1, 51):
        prov = random.choice(fornecedores)
        p = Produto.objects.create(
            descricao=f'Produto {i}',
            preco=Decimal(f'{10 + i}.00'),
            qtd_estoque=100,
            fornecedor=prov
        )
        produtos.append(p)

    # Criar Movimentações de Estoque (50)
    movimentos = []
    for i in range(1, 51):
        prod = random.choice(produtos)
        func = random.choice(funcionarios)
        tipo = random.choice(['ENTRADA', 'SAIDA'])
        q = random.randint(1, 20)
        m = MovimentacaoEstoque.objects.create(
            produto=prod,
            tipo=tipo,
            quantidade=q,
            funcionario=func,
            observacao='Movimentação de teste'
        )
        movimentos.append(m)

    # Criar Vendas (40) e Itens (cada uma com 1-5 itens)
    vendas = []
    for i in range(1, 41):
        cli = random.choice(clientes)
        fun = random.choice(funcionarios)
        v = Venda.objects.create(cliente=cli, funcionario=fun, total=Decimal('0.00'))
        total = Decimal('0.00')
        num_itens = random.randint(1, 5)
        for j in range(num_itens):
            prod = random.choice(produtos)
            qty = random.randint(1, 10)
            price = prod.preco
            subtotal = price * qty
            ItemVenda.objects.create(
                venda=v,
                produto=prod,
                quantidade=qty,
                preco_unitario=price,
                subtotal=subtotal
            )
            total += subtotal
            # decrementar estoque
            prod.qtd_estoque = max(0, prod.qtd_estoque - qty)
            prod.save()
        v.total = total
        v.save()
        vendas.append(v)

    print('População concluída:')
    print(f'  Fornecedores: {Fornecedor.objects.count()}')
    print(f'  Clientes: {Cliente.objects.count()}')
    print(f'  Funcionários: {Funcionario.objects.count()}')
    print(f'  Produtos: {Produto.objects.count()}')
    print(f'  Movimentações: {MovimentacaoEstoque.objects.count()}')
    print(f'  Vendas: {Venda.objects.count()}')
    print(f'  Itens Venda: {ItemVenda.objects.count()}')


if __name__ == '__main__':
    populate()
