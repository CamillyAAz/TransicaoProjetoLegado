from rest_framework.views import APIView
from rest_framework.response import Response
from clientes.models import Cliente
from fornecedores.models import Fornecedor
from clientes.serializers import ClienteSerializer
from fornecedores.serializers import FornecedorSerializer

class ConsultaClientesView(APIView):
    """
    GET -> retorna {"clientes": [...], "fornecedores": [...]}
    """
    def get(self, request):
        clientes = Cliente.objects.all()
        fornecedores = Fornecedor.objects.all()

        clientes_data = ClienteSerializer(clientes, many=True).data
        fornecedores_data = FornecedorSerializer(fornecedores, many=True).data

        return Response({
            "clientes": clientes_data,
            "fornecedores": fornecedores_data
        })