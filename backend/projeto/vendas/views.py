from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Venda, ItemVenda
from .serializers import VendaSerializer
from produtos.models import Produto
from produtos.services import ajustar_estoque
from whatsapp.services import whatsapp_service


@extend_schema_view(
    list=extend_schema(
        summary="Listar vendas",
        description="Retorna lista paginada de vendas com itens.",
        tags=['Vendas']
    ),
    create=extend_schema(
        summary="Registrar venda",
        description="Cria venda com itens e faz baixa de estoque.",
        tags=['Vendas']
    ),
    retrieve=extend_schema(
        summary="Detalhar venda",
        description="Retorna detalhes completos da venda.",
        tags=['Vendas']
    ),
)
class VendaViewSet(viewsets.ModelViewSet):
    queryset = Venda.objects.select_related('cliente', 'funcionario').prefetch_related('itens__produto')
    serializer_class = VendaSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['cliente']
    search_fields = ['observacao', 'cliente__nome']
    ordering_fields = ['data_venda', 'total']
    ordering = ['-data_venda']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            venda = Venda.objects.create(
                cliente=serializer.validated_data.get('cliente'),
                funcionario=request.user,
                observacao=serializer.validated_data.get('observacao')
            )

            total = 0
            itens_payload = serializer.validated_data.get('itens')
            itens_resposta = []

            for item in itens_payload:
                produto = item['produto']
                quantidade = item['quantidade']

                # valida estoque suficiente
                if produto.qtd_estoque < quantidade:
                    transaction.set_rollback(True)
                    return Response(
                        {'detail': f'Estoque insuficiente para produto {produto.descricao}.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                preco_unitario = produto.preco
                subtotal = preco_unitario * quantidade

                ItemVenda.objects.create(
                    venda=venda,
                    produto=produto,
                    quantidade=quantidade,
                    preco_unitario=preco_unitario,
                    subtotal=subtotal
                )

                # baixa estoque e registra movimentação via serviço central
                ajustar_estoque(
                    produto=produto,
                    tipo='SAIDA',
                    quantidade=quantidade,
                    funcionario=request.user,
                    observacao=f'Venda {venda.id}'
                )

                total += subtotal
                itens_resposta.append({
                    'descricao': produto.descricao,
                    'quantidade': quantidade,
                    'subtotal': str(subtotal)
                })

            venda.total = total
            venda.save(update_fields=['total'])

            # notificação opcional
            if venda.cliente:
                try:
                    whatsapp_service.notify_order_confirmation(venda.cliente, itens_resposta, str(total))
                except Exception:
                    pass

            output = VendaSerializer(venda)
            headers = self.get_success_headers(output.data)
            return Response(output.data, status=status.HTTP_201_CREATED, headers=headers)