from django.urls import path
from .views import ConsultaClientesView

urlpatterns = [
    path('clientes-fornecedores/', ConsultaClientesView.as_view(), name='consulta-clientes-fornecedores'),
]