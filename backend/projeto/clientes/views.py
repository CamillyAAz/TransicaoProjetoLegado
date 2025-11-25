from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.permissions import BasePermission
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiParameter
from .models import Cliente
from .serializers import ClienteSerializer
from .services import cep_service

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    class IsAdminOrReadOnly(BasePermission):
        def _normalize(self, s: str) -> str:
            s = (s or '').lower()
            if s in ('admin', 'administrador'):
                return 'admin'
            if s in ('usuario', 'usuário', 'user'):
                return 'usuario'
            return s
        def has_permission(self, request, view):
            if request.method in ('GET', 'HEAD', 'OPTIONS'):
                return request.user and request.user.is_authenticated
            user = request.user
            nivel = self._normalize(getattr(user, 'nivel_acesso', ''))
            return user and user.is_authenticated and (nivel in ['admin', 'usuario', 'gerente', 'vendedor'] or user.is_staff or user.is_superuser)

    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]

@extend_schema(
    summary="Consultar CEP",
    description="Retorna dados de endereço a partir de um CEP válido usando a API ViaCEP.",
    tags=['Clientes'],
    parameters=[
        OpenApiParameter(
            name='cep',
            description='CEP a ser consultado (formato: 12345678 ou 12345-678)',
            required=True,
            type=str,
            location=OpenApiParameter.QUERY
        )
    ],
    responses={
        200: {
            'type': 'object',
            'properties': {
                'cep': {'type': 'string', 'example': '01310-100'},
                'logradouro': {'type': 'string', 'example': 'Avenida Paulista'},
                'complemento': {'type': 'string', 'example': ''},
                'bairro': {'type': 'string', 'example': 'Bela Vista'},
                'cidade': {'type': 'string', 'example': 'São Paulo'},
                'estado': {'type': 'string', 'example': 'SP'}
            }
        },
        400: {
            'type': 'object',
            'properties': {
                'error': {'type': 'string', 'example': 'CEP é obrigatório'}
            }
        },
        404: {
            'type': 'object',
            'properties': {
                'error': {'type': 'string', 'example': 'CEP não encontrado ou inválido'}
            }
        }
    }
)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def consultar_cep(request):
    """
    Endpoint para consulta de CEP.
    
    Retorna automaticamente os dados de endereço baseado no CEP fornecido.
    Útil para preencher automaticamente formulários de cadastro de clientes.
    """
    cep = request.query_params.get('cep')
    
    if not cep:
        return Response(
            {'error': 'CEP é obrigatório'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    dados = cep_service.consultar_cep(cep)
    
    if dados is None:
        return Response(
            {'error': 'CEP não encontrado ou inválido'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    return Response(dados, status=status.HTTP_200_OK)
