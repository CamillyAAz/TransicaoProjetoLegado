from django.contrib import admin
from .models import Venda, ItemVenda


@admin.register(Venda)
class VendaAdmin(admin.ModelAdmin):
    list_display = ('id', 'cliente', 'funcionario', 'data_venda', 'total')
    search_fields = ('cliente__nome', 'observacao')
    list_filter = ('funcionario',)


@admin.register(ItemVenda)
class ItemVendaAdmin(admin.ModelAdmin):
    list_display = ('id', 'venda', 'produto', 'quantidade', 'preco_unitario', 'subtotal')
    search_fields = ('produto__descricao',)
    list_filter = ('produto',)