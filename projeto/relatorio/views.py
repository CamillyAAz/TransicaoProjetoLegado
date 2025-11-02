from rest_framework import viewsets
from .models import RelatorioVendas
from .serializers import RelatorioVendasSerializer
from rest_framework.permissions import IsAuthenticated

class RelatorioVendasViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RelatorioVendas.objects.all()
    serializer_class = RelatorioVendasSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = RelatorioVendas.objects.all()
        data_inicio = self.request.query_params.get('data_inicio', None)
        data_fim = self.request.query_params.get('data_fim', None)
        
        if data_inicio and data_fim:
            queryset = queryset.filter(data_geracao__range=[data_inicio, data_fim])
        
        return queryset