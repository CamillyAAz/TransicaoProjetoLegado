from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConsultaClienteViewSet

router = DefaultRouter()
router.register(r'consulta', ConsultaClienteViewSet, basename='consulta-cliente')

urlpatterns = [
    path('', include(router.urls)),
]
