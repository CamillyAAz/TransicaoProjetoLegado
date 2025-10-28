from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework.decorators import action
from django.db.models import Q, Case, When, Value, IntegerField
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

    @action(detail=False, methods=['get'], url_path='buscar-inteligente', permission_classes=[IsAuthenticated])
    @extend_schema(
        summary="Busca inteligente de produtos/estoque",
        description=(
            "Busca por código (id), descrição ou fornecedor com ranking de relevância.\n"
            "Parâmetros: q (obrigatório), low_stock=true|false, min_stock=int, fornecedor=int.\n"
            "Ordena por relevância e retorna a lista de produtos compatíveis."
        ),
        tags=['Produtos']
    )
    def buscar_inteligente(self, request):
        q = (request.query_params.get('q') or '').strip()
        if not q:
            return Response({'detail': 'Parâmetro q é obrigatório.'}, status=400)

        # parâmetros auxiliares
        low_stock = str(request.query_params.get('low_stock', '')).lower() in ('1', 'true', 'sim')
        try:
            min_stock = int(request.query_params.get('min_stock', 5))
        except Exception:
            min_stock = 5
        fornecedor_id = request.query_params.get('fornecedor')

        qs = Produto.objects.select_related('fornecedor')

        # filtros por termos
        code_filter = Q()
        if q.isdigit():
            code_filter = Q(id=int(q))

        tokens = [t for t in q.split() if t]
        desc_filter = Q()
        for t in tokens:
            desc_filter &= Q(descricao__icontains=t)

        supplier_filter = Q(fornecedor__nome__icontains=q)

        qs = qs.filter(code_filter | desc_filter | supplier_filter)

        if fornecedor_id:
            qs = qs.filter(fornecedor_id=fornecedor_id)

        if low_stock:
            qs = qs.filter(qtd_estoque__lte=min_stock)

        # ranking de relevância
        whens = []
        if q.isdigit():
            whens.append(When(id=int(q), then=Value(5)))
        whens.append(When(descricao__istartswith=q, then=Value(4)))
        whens.append(When(descricao__icontains=q, then=Value(3)))
        whens.append(When(fornecedor__nome__icontains=q, then=Value(2)))

        qs = qs.annotate(score=Case(*whens, default=Value(1), output_field=IntegerField()))
        qs = qs.order_by('-score', 'descricao')

        data = ProdutoSerializer(qs, many=True).data
        return Response({'count': qs.count(), 'results': data})


@extend_schema_view(
    list=extend_schema(
        summary="Listar movimentações de estoque",
        description="Retorna lista paginada de entradas e saídas com filtros.",
        tags=['Estoque']
    ),
    create=extend_schema(
        summary="Registrar movimentação",
        description="Cria uma entrada ou saída de estoque e atualiza o produto.",
        tags=['Estoque']
    ),
    retrieve=extend_schema(
        summary="Buscar movimentação",
        description="Retorna os detalhes de uma movimentação específica.",
        tags=['Estoque']
    ),
    destroy=extend_schema(
        summary="Remover movimentação",
        description="Remove uma movimentação (não reverte estoque automaticamente).",
        tags=['Estoque']
    ),
)
class MovimentacaoEstoqueViewSet(viewsets.ModelViewSet):
    """
    API para controle de entrada e saída de produtos.

    - Valida estoque suficiente para saídas
    - Atualiza a quantidade do produto de forma atômica
    - Registra o funcionário responsável
    """
    queryset = MovimentacaoEstoque.objects.select_related('produto').all()
    serializer_class = MovimentacaoEstoqueSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['produto', 'tipo']
    search_fields = ['produto__descricao']
    ordering_fields = ['data_movimento', 'quantidade']
    ordering = ['-data_movimento']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        dados = serializer.validated_data
        movimentacao = ajustar_estoque(
            produto=dados["produto"],
            tipo=dados["tipo"],
            quantidade=dados["quantidade"],
            funcionario=request.user,
            observacao=dados.get("observacao", "")
        )

        output = self.get_serializer(instance=movimentacao)
        headers = self.get_success_headers(output.data)
        return Response(output.data, status=201, headers=headers)
