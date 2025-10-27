from rest_framework import viewsets, permissions
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from .models import Fornecedor
from .serializers import FornecedorSerializer

class FornecedorPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class FornecedorViewSet(viewsets.ModelViewSet):
    queryset = Fornecedor.objects.all()
    serializer_class = FornecedorSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = FornecedorPagination

    def get_queryset(self):
        qs = super().get_queryset()
        # Filtro por nome (consulta simples)
        q = self.request.query_params.get('q')
        if q:
            qs = qs.filter(nome__icontains=q)
        # Ordenação por campos permitidos
        ordering = self.request.query_params.get('ordering')
        allowed_ordering = {'nome', 'cnpj', 'cidade', 'estado'}
        if ordering:
            # Suporta '-' para descendente
            field = ordering.lstrip('-')
            if field in allowed_ordering:
                qs = qs.order_by(ordering)
        return qs
