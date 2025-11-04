from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.db.models import Sum, Count, Q
from datetime import datetime, timedelta
from .serializers import RelatorioGeralSerializer
from vendas.models import Venda, ItemVenda
from produtos.models import Produto, MovimentacaoEstoque
from clientes.models import Cliente
from fornecedores.models import Fornecedor
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes


class RelatorioGeralViewSet(viewsets.ViewSet):
    """
    ViewSet para relatório geral do sistema.
    
    Fornece estatísticas consolidadas sobre vendas, produtos, clientes, 
    estoque e fornecedores. Apenas administradores têm acesso.
    """
    permission_classes = [IsAdminUser]
    serializer_class = RelatorioGeralSerializer

    @extend_schema(
        summary="Relatório Geral do Sistema",
        description="""
        Retorna um relatório consolidado com informações de:
        - Total de vendas e valor total
        - Total de clientes, produtos e fornecedores
        - Últimas 10 vendas
        - Produtos com estoque baixo
        - Clientes com mais compras
        - Produtos mais vendidos
        - Fornecedores ativos
        
        **Permissão necessária:** Admin
        """,
        parameters=[
            OpenApiParameter(
                name='data_inicio',
                type=OpenApiTypes.DATE,
                location=OpenApiParameter.QUERY,
                description='Data inicial para filtrar vendas (formato: YYYY-MM-DD)',
                required=False
            ),
            OpenApiParameter(
                name='data_fim',
                type=OpenApiTypes.DATE,
                location=OpenApiParameter.QUERY,
                description='Data final para filtrar vendas (formato: YYYY-MM-DD)',
                required=False
            ),
        ],
        responses={200: RelatorioGeralSerializer}
    )
    def list(self, request):
        """Retorna o relatório geral do sistema"""
        
        # Filtros de data
        data_inicio = request.query_params.get('data_inicio')
        data_fim = request.query_params.get('data_fim')
        
        # Query de vendas com filtro de data
        vendas_query = Venda.objects.all()
        if data_inicio and data_fim:
            vendas_query = vendas_query.filter(data_venda__range=[data_inicio, data_fim])
        elif data_inicio:
            vendas_query = vendas_query.filter(data_venda__gte=data_inicio)
        elif data_fim:
            vendas_query = vendas_query.filter(data_venda__lte=data_fim)
        
        # Estatísticas gerais
        total_vendas = vendas_query.count()
        valor_total_vendas = vendas_query.aggregate(total=Sum('valor_total'))['total'] or 0
        total_clientes = Cliente.objects.count()
        total_produtos = Produto.objects.count()
        total_fornecedores = Fornecedor.objects.count()
        
        # Vendas recentes
        vendas_recentes = list(vendas_query.order_by('-data_venda')[:10].values(
            'id', 'data_venda', 'valor_total', 'cliente__nome', 'funcionario__nome'
        ))
        
        # Produtos com estoque baixo
        produtos_estoque_baixo = list(Produto.objects.filter(
            quantidade_estoque__lt=10
        ).values('id', 'nome', 'quantidade_estoque', 'preco_venda'))
        
        # Clientes com mais compras
        clientes_mais_compradores = list(
            Venda.objects.values('cliente__id', 'cliente__nome')
            .annotate(total_compras=Count('id'), valor_total=Sum('valor_total'))
            .order_by('-total_compras')[:10]
        )
        
        # Produtos mais vendidos
        produtos_mais_vendidos = list(
            ItemVenda.objects.values('produto__id', 'produto__nome')
            .annotate(
                total_vendido=Sum('quantidade'),
                valor_total=Sum('subtotal')
            )
            .order_by('-total_vendido')[:10]
        )
        
        # Fornecedores ativos (com produtos cadastrados)
        fornecedores_ativos = list(
            Fornecedor.objects.annotate(
                total_produtos=Count('produto')
            ).filter(total_produtos__gt=0)
            .values('id', 'nome', 'telefone', 'email', 'total_produtos')
            .order_by('-total_produtos')[:10]
        )
        
        # Montar resposta
        relatorio = {
            'total_vendas': total_vendas,
            'valor_total_vendas': float(valor_total_vendas),
            'total_clientes': total_clientes,
            'total_produtos': total_produtos,
            'total_fornecedores': total_fornecedores,
            'vendas_recentes': vendas_recentes,
            'produtos_estoque_baixo': produtos_estoque_baixo,
            'clientes_mais_compradores': clientes_mais_compradores,
            'produtos_mais_vendidos': produtos_mais_vendidos,
            'fornecedores_ativos': fornecedores_ativos,
        }
        
        serializer = RelatorioGeralSerializer(relatorio)
        return Response(serializer.data)
    
    @extend_schema(
        summary="Estatísticas de Estoque",
        description="Retorna estatísticas detalhadas sobre o estoque de produtos",
        responses={200: {
            'type': 'object',
            'properties': {
                'total_produtos': {'type': 'integer'},
                'valor_total_estoque': {'type': 'number'},
                'produtos_sem_estoque': {'type': 'integer'},
                'movimentacoes_recentes': {'type': 'array'}
            }
        }}
    )
    @action(detail=False, methods=['get'], url_path='estatisticas-estoque')
    def estatisticas_estoque(self, request):
        """Retorna estatísticas detalhadas sobre o estoque"""
        
        total_produtos = Produto.objects.count()
        produtos_sem_estoque = Produto.objects.filter(quantidade_estoque=0).count()
        
        # Valor total do estoque
        valor_total_estoque = Produto.objects.aggregate(
            total=Sum('quantidade_estoque') * Sum('preco_venda')
        )
        
        # Movimentações recentes
        movimentacoes_recentes = list(
            MovimentacaoEstoque.objects.select_related('produto')
            .order_by('-data_movimentacao')[:20]
            .values(
                'id', 'produto__nome', 'tipo_movimentacao', 
                'quantidade', 'data_movimentacao', 'observacao'
            )
        )
        
        return Response({
            'total_produtos': total_produtos,
            'valor_total_estoque': valor_total_estoque.get('total', 0) or 0,
            'produtos_sem_estoque': produtos_sem_estoque,
            'movimentacoes_recentes': movimentacoes_recentes
        })