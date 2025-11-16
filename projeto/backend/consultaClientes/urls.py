from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConsultaClientesFornecedoresViewSet

router = DefaultRouter()
router.register(r'', ConsultaClientesFornecedoresViewSet, basename='consultas')

urlpatterns = [
    path('', include(router.urls)),
]
