from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Sum, Q
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from clientes.models import Cliente
from fornecedores.models import Fornecedor
from vendas.models import Venda
from produtos.models import Produto
from .serializers import (
    ClienteDetalhadoSerializer,
    FornecedorDetalhadoSerializer,
    ConsultaConsolidadaSerializer
)


class ConsultaClientesFornecedoresViewSet(viewsets.ViewSet):
    """
    ViewSet para consulta consolidada de Clientes e Fornecedores.
    
    Fornece endpoints para visualizar todos os dados de clientes e fornecedores,
    incluindo estatísticas e informações detalhadas.
    """
    permission_classes = [IsAuthenticated]
    
    @extend_schema(
        summary="Lista todos os Clientes com detalhes",
        description="""
        Retorna lista completa de todos os clientes cadastrados com:
        - Dados pessoais completos
        - Informações de contato
        - Endereço completo
        - Total de compras realizadas
        - Valor total gasto
        
        **Filtros disponíveis:**
        - nome: Filtrar por nome do cliente
        - cidade: Filtrar por cidade
        - estado: Filtrar por estado (UF)
        - cpf: Buscar por CPF específico
        """,
        parameters=[
            OpenApiParameter(
                name='nome',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Filtrar por nome (busca parcial)',
                required=False
            ),
            OpenApiParameter(
                name='cidade',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Filtrar por cidade',
                required=False
            ),
            OpenApiParameter(
                name='estado',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Filtrar por estado (UF - 2 caracteres)',
                required=False
            ),
            OpenApiParameter(
                name='cpf',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Buscar por CPF específico',
                required=False
            ),
        ],
        responses={200: ClienteDetalhadoSerializer(many=True)},
        tags=['Consultas']
    )
    @action(detail=False, methods=['get'], url_path='clientes')
    def listar_clientes(self, request):
        """Retorna lista completa de clientes com informações detalhadas"""
        
        # Query base
        queryset = Cliente.objects.all()
        
        # Aplicar filtros
        nome = request.query_params.get('nome')
        cidade = request.query_params.get('cidade')
        estado = request.query_params.get('estado')
        cpf = request.query_params.get('cpf')
        
        if nome:
            queryset = queryset.filter(nome__icontains=nome)
        if cidade:
            queryset = queryset.filter(cidade__icontains=cidade)
        if estado:
            queryset = queryset.filter(estado__iexact=estado)
        if cpf:
            queryset = queryset.filter(cpf=cpf)
        
        # Adicionar estatísticas de compras
        queryset = queryset.annotate(
            total_compras=Count('venda'),
            valor_total_compras=Sum('venda__valor_total')
        ).order_by('nome')
        
        serializer = ClienteDetalhadoSerializer(queryset, many=True)
        return Response({
            'total': queryset.count(),
            'clientes': serializer.data
        })
    
    @extend_schema(
        summary="Lista todos os Fornecedores com detalhes",
        description="""
        Retorna lista completa de todos os fornecedores cadastrados com:
        - Dados empresariais completos
        - Informações de contato
        - Endereço completo
        - Total de produtos fornecidos
        - Quantidade de produtos ativos em estoque
        
        **Filtros disponíveis:**
        - nome: Filtrar por nome
        - cidade: Filtrar por cidade
        - estado: Filtrar por estado (UF)
        - cnpj: Buscar por CNPJ específico
        """,
        parameters=[
            OpenApiParameter(
                name='nome',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Filtrar por nome (busca parcial)',
                required=False
            ),
            OpenApiParameter(
                name='cidade',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Filtrar por cidade',
                required=False
            ),
            OpenApiParameter(
                name='estado',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Filtrar por estado (UF - 2 caracteres)',
                required=False
            ),
            OpenApiParameter(
                name='cnpj',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Buscar por CNPJ específico',
                required=False
            ),
        ],
        responses={200: FornecedorDetalhadoSerializer(many=True)},
        tags=['Consultas']
    )
    @action(detail=False, methods=['get'], url_path='fornecedores')
    def listar_fornecedores(self, request):
        """Retorna lista completa de fornecedores com informações detalhadas"""
        
        # Query base
        queryset = Fornecedor.objects.all()
        
        # Aplicar filtros
        nome = request.query_params.get('nome')
        cidade = request.query_params.get('cidade')
        estado = request.query_params.get('estado')
        cnpj = request.query_params.get('cnpj')
        
        if nome:
            queryset = queryset.filter(nome__icontains=nome)
        if cidade:
            queryset = queryset.filter(cidade__icontains=cidade)
        if estado:
            queryset = queryset.filter(estado__iexact=estado)
        if cnpj:
            queryset = queryset.filter(cnpj=cnpj)
        
        # Adicionar estatísticas de produtos
        queryset = queryset.annotate(
            total_produtos=Count('produto'),
            produtos_ativos=Count('produto', filter=Q(produto__quantidade_estoque__gt=0))
        ).order_by('nome')
        
        serializer = FornecedorDetalhadoSerializer(queryset, many=True)
        return Response({
            'total': queryset.count(),
            'fornecedores': serializer.data
        })
    
    @extend_schema(
        summary="Consulta Consolidada - Clientes e Fornecedores",
        description="""
        Retorna uma visão consolidada com TODOS os dados de:
        - **Clientes**: Lista completa com estatísticas de compras
        - **Fornecedores**: Lista completa com estatísticas de produtos
        - **Totais**: Quantidade total de cada
        
        **Ideal para:**
        - Dashboards gerenciais
        - Relatórios executivos
        - Exportação de dados completos
        - Análises consolidadas
        
        **Atenção**: Este endpoint pode retornar grandes volumes de dados.
        Use os endpoints específicos com filtros para consultas mais direcionadas.
        """,
        responses={200: ConsultaConsolidadaSerializer},
        tags=['Consultas']
    )
    @action(detail=False, methods=['get'], url_path='consolidado')
    def consulta_consolidada(self, request):
        """Retorna dados consolidados de clientes e fornecedores"""
        
        # Buscar clientes com estatísticas
        clientes = Cliente.objects.annotate(
            total_compras=Count('venda'),
            valor_total_compras=Sum('venda__valor_total')
        ).order_by('nome')
        
        # Buscar fornecedores com estatísticas
        fornecedores = Fornecedor.objects.annotate(
            total_produtos=Count('produto'),
            produtos_ativos=Count('produto', filter=Q(produto__quantidade_estoque__gt=0))
        ).order_by('nome')
        
        # Montar resposta
        data = {
            'total_clientes': clientes.count(),
            'total_fornecedores': fornecedores.count(),
            'clientes': ClienteDetalhadoSerializer(clientes, many=True).data,
            'fornecedores': FornecedorDetalhadoSerializer(fornecedores, many=True).data,
        }
        
        serializer = ConsultaConsolidadaSerializer(data)
        return Response(serializer.data)
    
    @extend_schema(
        summary="Buscar Cliente por ID",
        description="Retorna todos os dados de um cliente específico pelo ID, incluindo histórico de compras",
        responses={200: ClienteDetalhadoSerializer},
        tags=['Consultas']
    )
    @action(detail=True, methods=['get'], url_path='cliente')
    def detalhe_cliente(self, request, pk=None):
        """Retorna detalhes completos de um cliente específico"""
        
        try:
            cliente = Cliente.objects.annotate(
                total_compras=Count('venda'),
                valor_total_compras=Sum('venda__valor_total')
            ).get(pk=pk)
            
            serializer = ClienteDetalhadoSerializer(cliente)
            return Response(serializer.data)
        except Cliente.DoesNotExist:
            return Response(
                {'erro': 'Cliente não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @extend_schema(
        summary="Buscar Fornecedor por ID",
        description="Retorna todos os dados de um fornecedor específico pelo ID, incluindo produtos fornecidos",
        responses={200: FornecedorDetalhadoSerializer},
        tags=['Consultas']
    )
    @action(detail=True, methods=['get'], url_path='fornecedor')
    def detalhe_fornecedor(self, request, pk=None):
        """Retorna detalhes completos de um fornecedor específico"""
        
        try:
            fornecedor = Fornecedor.objects.annotate(
                total_produtos=Count('produto'),
                produtos_ativos=Count('produto', filter=Q(produto__quantidade_estoque__gt=0))
            ).get(pk=pk)
            
            serializer = FornecedorDetalhadoSerializer(fornecedor)
            return Response(serializer.data)
        except Fornecedor.DoesNotExist:
            return Response(
                {'erro': 'Fornecedor não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
