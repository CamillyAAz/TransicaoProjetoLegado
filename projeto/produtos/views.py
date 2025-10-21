from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Fornecedor, Produto
from .serializers import FornecedorSerializer, ProdutoSerializer


@extend_schema_view(
    list=extend_schema(
        summary="Listar fornecedores",
        description="Retorna lista paginada de todos os fornecedores com filtros opcionais.",
        tags=['Fornecedores']
    ),
    create=extend_schema(
        summary="Criar fornecedor",
        description="Cria um novo fornecedor no sistema.",
        tags=['Fornecedores']
    ),
    retrieve=extend_schema(
        summary="Buscar fornecedor",
        description="Retorna os detalhes de um fornecedor específico.",
        tags=['Fornecedores']
    ),
    update=extend_schema(
        summary="Atualizar fornecedor",
        description="Atualiza todos os campos de um fornecedor.",
        tags=['Fornecedores']
    ),
    partial_update=extend_schema(
        summary="Atualizar fornecedor parcialmente",
        description="Atualiza campos específicos de um fornecedor.",
        tags=['Fornecedores']
    ),
    destroy=extend_schema(
        summary="Deletar fornecedor",
        description="Remove um fornecedor do sistema.",
        tags=['Fornecedores']
    ),
)
class FornecedorViewSet(viewsets.ModelViewSet):
    """
    API para gerenciamento de fornecedores.
    
    Permite realizar operações CRUD completas com filtros por estado, cidade,
    busca por nome/CNPJ/email e ordenação personalizada.
    """
    queryset = Fornecedor.objects.all()
    serializer_class = FornecedorSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estado', 'cidade']
    search_fields = ['nome', 'cnpj', 'email']
    ordering_fields = ['nome', 'id']
    ordering = ['nome']


@extend_schema_view(
    list=extend_schema(
        summary="Listar produtos",
        description="Retorna lista paginada de todos os produtos com informações do fornecedor.",
        tags=['Produtos']
    ),
    create=extend_schema(
        summary="Criar produto",
        description="Adiciona um novo produto ao catálogo.",
        tags=['Produtos']
    ),
    retrieve=extend_schema(
        summary="Buscar produto",
        description="Retorna os detalhes de um produto específico.",
        tags=['Produtos']
    ),
    update=extend_schema(
        summary="Atualizar produto",
        description="Atualiza todos os campos de um produto.",
        tags=['Produtos']
    ),
    partial_update=extend_schema(
        summary="Atualizar produto parcialmente",
        description="Atualiza campos específicos de um produto (ex: apenas estoque).",
        tags=['Produtos']
    ),
    destroy=extend_schema(
        summary="Deletar produto",
        description="Remove um produto do catálogo.",
        tags=['Produtos']
    ),
)
class ProdutoViewSet(viewsets.ModelViewSet):
    """
    API para gerenciamento de produtos.
    
    Permite realizar operações CRUD completas com filtros por fornecedor,
    busca por descrição e ordenação por preço, estoque ou descrição.
    """
    queryset = Produto.objects.select_related('fornecedor').all()
    serializer_class = ProdutoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['fornecedor']
    search_fields = ['descricao']
    ordering_fields = ['descricao', 'preco', 'qtd_estoque']
    ordering = ['descricao']
