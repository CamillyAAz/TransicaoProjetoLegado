from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from clientes.models import Cliente
from .serializers import ConsultaClienteSerializer, ConsultaClienteDetalhadaSerializer


class ConsultaClienteViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para consulta de clientes com funcionalidades de busca e filtros
    """
    queryset = Cliente.objects.all()
    serializer_class = ConsultaClienteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nome', 'cpf', 'email', 'cidade']
    filterset_fields = ['estado', 'cidade']
    ordering_fields = ['nome', 'id', 'cidade']
    ordering = ['nome']

    def get_serializer_class(self):
        """
        Retorna o serializer apropriado baseado na ação
        """
        if self.action == 'detalhado':
            return ConsultaClienteDetalhadaSerializer
        return ConsultaClienteSerializer

    @action(detail=False, methods=['get'])
    def buscar_por_cpf(self, request):
        """
        Busca cliente por CPF específico
        """
        cpf = request.query_params.get('cpf', None)
        if not cpf:
            return Response(
                {'erro': 'Parâmetro CPF é obrigatório'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            cliente = Cliente.objects.get(cpf=cpf)
            serializer = self.get_serializer(cliente)
            return Response(serializer.data)
        except Cliente.DoesNotExist:
            return Response(
                {'erro': 'Cliente não encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def buscar_por_nome(self, request):
        """
        Busca clientes por nome (busca parcial)
        """
        nome = request.query_params.get('nome', None)
        if not nome:
            return Response(
                {'erro': 'Parâmetro nome é obrigatório'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        clientes = Cliente.objects.filter(nome__icontains=nome)
        serializer = self.get_serializer(clientes, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def buscar_por_cidade(self, request):
        """
        Busca clientes por cidade
        """
        cidade = request.query_params.get('cidade', None)
        if not cidade:
            return Response(
                {'erro': 'Parâmetro cidade é obrigatório'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        clientes = Cliente.objects.filter(cidade__icontains=cidade)
        serializer = self.get_serializer(clientes, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def buscar_por_estado(self, request):
        """
        Busca clientes por estado
        """
        estado = request.query_params.get('estado', None)
        if not estado:
            return Response(
                {'erro': 'Parâmetro estado é obrigatório'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        clientes = Cliente.objects.filter(estado__iexact=estado)
        serializer = self.get_serializer(clientes, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def buscar_por_email(self, request):
        """
        Busca cliente por email específico
        """
        email = request.query_params.get('email', None)
        if not email:
            return Response(
                {'erro': 'Parâmetro email é obrigatório'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            cliente = Cliente.objects.get(email__iexact=email)
            serializer = self.get_serializer(cliente)
            return Response(serializer.data)
        except Cliente.DoesNotExist:
            return Response(
                {'erro': 'Cliente não encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def buscar_por_telefone(self, request):
        """
        Busca clientes por telefone ou celular
        """
        telefone = request.query_params.get('telefone', None)
        if not telefone:
            return Response(
                {'erro': 'Parâmetro telefone é obrigatório'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        clientes = Cliente.objects.filter(
            Q(telefone__icontains=telefone) | Q(celular__icontains=telefone)
        )
        serializer = self.get_serializer(clientes, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def estatisticas(self, request):
        """
        Retorna estatísticas dos clientes
        """
        total_clientes = Cliente.objects.count()
        clientes_por_estado = Cliente.objects.values('estado').distinct().count()
        clientes_por_cidade = Cliente.objects.values('cidade').distinct().count()
        
        return Response({
            'total_clientes': total_clientes,
            'estados_distintos': clientes_por_estado,
            'cidades_distintas': clientes_por_cidade
        })

    @action(detail=True, methods=['get'])
    def detalhado(self, request, pk=None):
        """
        Retorna detalhes completos de um cliente específico
        """
        cliente = self.get_object()
        serializer = self.get_serializer(cliente)
        return Response(serializer.data)
