from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RelatorioVendasViewSet

router = DefaultRouter()
router.register(r'vendas', RelatorioVendasViewSet)

urlpatterns = [
    path('', include(router.urls)),
]