from rest_framework import viewsets, generics, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Funcionario
from .serializers import FuncionarioSerializer


@extend_schema_view(
    list=extend_schema(
        summary="Listar funcionários",
        description="Retorna lista paginada de todos os funcionários do sistema com filtros opcionais.",
        tags=['Funcionários']
    ),
    create=extend_schema(
        summary="Criar funcionário",
        description="Cadastra um novo funcionário no sistema.",
        tags=['Funcionários']
    ),
    retrieve=extend_schema(
        summary="Buscar funcionário",
        description="Retorna os detalhes de um funcionário específico.",
        tags=['Funcionários']
    ),
    update=extend_schema(
        summary="Atualizar funcionário",
        description="Atualiza todos os campos de um funcionário.",
        tags=['Funcionários']
    ),
    partial_update=extend_schema(
        summary="Atualizar funcionário parcialmente",
        description="Atualiza campos específicos de um funcionário.",
        tags=['Funcionários']
    ),
    destroy=extend_schema(
        summary="Deletar funcionário",
        description="Remove um funcionário do sistema.",
        tags=['Funcionários']
    ),
)
class FuncionarioViewSet(viewsets.ModelViewSet):
    queryset = Funcionario.objects.all()
    serializer_class = FuncionarioSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['cargo', 'nivel_acesso', 'is_active']
    search_fields = ['nome', 'email', 'cpf']
    ordering_fields = ['nome', 'email', 'cargo']
    ordering = ['nome']
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    @extend_schema(
        summary="Alterar senha",
        description="Permite que um funcionário altere sua própria senha.",
        tags=['Funcionários'],
        request={
            'application/json': {
                'type': 'object',
                'properties': {
                    'old_password': {'type': 'string'},
                    'new_password': {'type': 'string'}
                }
            }
        }
    )
    @action(detail=True, methods=['post'])
    def change_password(self, request, pk=None):
        funcionario = self.get_object()
        
        if funcionario != request.user:
            return Response(
                {'error': 'Você só pode alterar sua própria senha'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        if not old_password or not new_password:
            return Response(
                {'error': 'Senha antiga e nova são obrigatórias'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not funcionario.check_password(old_password):
            return Response(
                {'error': 'Senha atual incorreta'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if len(new_password) < 8:
            return Response(
                {'error': 'A senha deve ter pelo menos 8 caracteres'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        funcionario.set_password(new_password)
        funcionario.save()
        
        return Response({'message': 'Senha alterada com sucesso'})


@extend_schema(
    summary="Registrar funcionário",
    description="Endpoint público para registro de novos funcionários.",
    tags=['Autenticação']
)
class FuncionarioCreateView(generics.CreateAPIView):
    queryset = Funcionario.objects.all()
    serializer_class = FuncionarioSerializer
    permission_classes = [permissions.AllowAny]


@extend_schema(
    summary="Login",
    description="Autentica um funcionário e retorna tokens JWT (access e refresh).",
    tags=['Autenticação'],
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'email': {'type': 'string', 'format': 'email'},
                'password': {'type': 'string'}
            },
            'required': ['email', 'password']
        }
    },
    responses={
        200: {
            'type': 'object',
            'properties': {
                'refresh': {'type': 'string'},
                'access': {'type': 'string'},
                'user': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'nome': {'type': 'string'},
                        'email': {'type': 'string'},
                        'cargo': {'type': 'string'},
                        'nivel_acesso': {'type': 'string'}
                    }
                }
            }
        }
    }
)
class LoginView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, email=email, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'nome': user.nome,
                    'email': user.email,
                    'cargo': user.cargo,
                    'nivel_acesso': user.nivel_acesso
                }
            })
        else:
            return Response({'error': 'Credenciais inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
