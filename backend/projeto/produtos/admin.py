from django.contrib import admin
from .models import Fornecedor, Produto, MovimentacaoEstoque


@admin.register(Fornecedor)
class FornecedorAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome', 'cnpj', 'email', 'telefone', 'cidade', 'estado')
    search_fields = ('nome', 'cnpj', 'email')
    list_filter = ('estado', 'cidade')


@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ('id', 'descricao', 'preco', 'qtd_estoque', 'fornecedor')
    search_fields = ('descricao',)
    list_filter = ('fornecedor',)


@admin.register(MovimentacaoEstoque)
class MovimentacaoEstoqueAdmin(admin.ModelAdmin):
    list_display = ('id', 'produto', 'tipo', 'quantidade', 'data_movimento', 'funcionario')
    search_fields = ('produto__descricao',)
    list_filter = ('tipo',)
