from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter
from .services import whatsapp_service
from clientes.models import Cliente
from produtos.models import Produto, Fornecedor
from accounts.models import Funcionario


@extend_schema(
    summary="Enviar mensagem WhatsApp",
    description="Envia uma mensagem personalizada via WhatsApp.",
    tags=['WhatsApp'],
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'phone_number': {'type': 'string', 'example': '5545999999999'},
                'message': {'type': 'string', 'example': 'Olá! Esta é uma mensagem de teste.'},
                'campaign_name': {'type': 'string', 'example': 'Teste'}
            },
            'required': ['phone_number', 'message']
        }
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_whatsapp_message(request):
    phone_number = request.data.get('phone_number')
    message = request.data.get('message')
    campaign_name = request.data.get('campaign_name', 'Mensagem Personalizada')
    
    if not phone_number or not message:
        return Response(
            {'error': 'phone_number e message são obrigatórios'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        result = whatsapp_service.send_message(phone_number, message, campaign_name)
        return Response({
            'success': True,
            'message': 'Mensagem enviada com sucesso',
            'data': result
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@extend_schema(
    summary="Notificar produto novo",
    description="Envia notificação de novo produto para um cliente.",
    tags=['WhatsApp']
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def notify_new_product(request):
    cliente_id = request.data.get('cliente_id')
    produto_id = request.data.get('produto_id')
    
    try:
        cliente = Cliente.objects.get(id=cliente_id)
        produto = Produto.objects.get(id=produto_id)
        
        result = whatsapp_service.notify_new_product(cliente, produto)
        return Response({
            'success': True,
            'message': 'Notificação enviada com sucesso',
            'data': result
        })
    except (Cliente.DoesNotExist, Produto.DoesNotExist) as e:
        return Response(
            {'error': 'Cliente ou produto não encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@extend_schema(
    summary="Notificar estoque baixo",
    description="Envia notificação de estoque baixo para o fornecedor.",
    tags=['WhatsApp']
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def notify_low_stock(request):
    produto_id = request.data.get('produto_id')
    
    try:
        produto = Produto.objects.select_related('fornecedor').get(id=produto_id)
        
        result = whatsapp_service.notify_low_stock(produto, produto.fornecedor)
        return Response({
            'success': True,
            'message': 'Notificação enviada com sucesso',
            'data': result
        })
    except Produto.DoesNotExist:
        return Response(
            {'error': 'Produto não encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@extend_schema(
    summary="Notificar cadastro de usuário",
    description="Envia notificação de cadastro realizado para um funcionário.",
    tags=['WhatsApp']
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def notify_user_created(request):
    funcionario_id = request.data.get('funcionario_id')
    
    try:
        funcionario = Funcionario.objects.get(id=funcionario_id)
        
        result = whatsapp_service.notify_user_created(funcionario)
        return Response({
            'success': True,
            'message': 'Notificação enviada com sucesso',
            'data': result
        })
    except Funcionario.DoesNotExist:
        return Response(
            {'error': 'Funcionário não encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
