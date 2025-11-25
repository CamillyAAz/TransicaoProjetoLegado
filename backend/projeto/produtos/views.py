from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view
from django.db import transaction
from .models import Fornecedor, Produto, MovimentacaoEstoque
from .serializers import FornecedorSerializer, ProdutoSerializer, MovimentacaoEstoqueSerializer
from .services import ajustar_estoque


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
    )
)
class FornecedorViewSet(viewsets.ModelViewSet):
    queryset = Fornecedor.objects.all()
    serializer_class = FornecedorSerializer
    class IsAdminOrReadOnly(BasePermission):
        def _normalize(self, s: str) -> str:
            s = (s or '').lower()
            if s in ('admin', 'administrador'):
                return 'admin'
            return s
        def has_permission(self, request, view):
            if request.method in ('GET', 'HEAD', 'OPTIONS'):
                return request.user and request.user.is_authenticated
            user = request.user
            nivel = self._normalize(getattr(user, 'nivel_acesso', ''))
            return user and user.is_authenticated and (nivel == 'admin' or user.is_staff or user.is_superuser)

    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['cidade', 'estado']
    search_fields = ['nome', 'cnpj', 'email']
    ordering_fields = ['nome', 'cidade']
    ordering = ['nome']


@extend_schema_view(
    list=extend_schema(
        summary="Listar produtos",
        description="Retorna lista paginada de todos os produtos com filtros opcionais.",
        tags=['Produtos']
    ),
    create=extend_schema(
        summary="Criar produto",
        description="Cria um novo produto no sistema.",
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
        description="Atualiza campos específicos de um produto.",
        tags=['Produtos']
    ),
    destroy=extend_schema(
        summary="Deletar produto",
        description="Remove um produto do sistema.",
        tags=['Produtos']
    )
)
class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.select_related('fornecedor').all()
    serializer_class = ProdutoSerializer
    class IsAdminOrReadOnly(BasePermission):
        def _normalize(self, s: str) -> str:
            s = (s or '').lower()
            if s in ('admin', 'administrador'):
                return 'admin'
            return s
        def has_permission(self, request, view):
            if request.method in ('GET', 'HEAD', 'OPTIONS'):
                return request.user and request.user.is_authenticated
            user = request.user
            nivel = self._normalize(getattr(user, 'nivel_acesso', ''))
            return user and user.is_authenticated and (nivel == 'admin' or user.is_staff or user.is_superuser)

    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['fornecedor', 'preco']
    search_fields = ['descricao', 'fornecedor__nome']
    ordering_fields = ['descricao', 'preco', 'qtd_estoque']
    ordering = ['descricao']


@extend_schema_view(
    list=extend_schema(
        summary="Listar movimentações de estoque",
        description="Retorna lista paginada de todas as movimentações de estoque.",
        tags=['Movimentações de Estoque']
    ),
    create=extend_schema(
        summary="Criar movimentação de estoque",
        description="Registra uma nova movimentação de estoque (entrada ou saída).",
        tags=['Movimentações de Estoque']
    ),
    retrieve=extend_schema(
        summary="Buscar movimentação de estoque",
        description="Retorna os detalhes de uma movimentação específica.",
        tags=['Movimentações de Estoque']
    )
)
class MovimentacaoEstoqueViewSet(viewsets.ModelViewSet):
    queryset = MovimentacaoEstoque.objects.select_related('produto', 'funcionario').all()
    serializer_class = MovimentacaoEstoqueSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tipo', 'produto', 'funcionario']
    search_fields = ['produto__descricao', 'observacao']
    ordering_fields = ['data_movimento', 'quantidade']
    ordering = ['-data_movimento']

    def perform_create(self, serializer):
        movimentacao = serializer.save(funcionario=self.request.user)
        ajustar_estoque(movimentacao.produto, movimentacao.tipo, movimentacao.quantidade)
