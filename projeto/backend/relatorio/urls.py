from django.urls import path, include
from rest_framework import routers
from .views import RelatorioGeralViewSet

router = routers.DefaultRouter()
router.register(r'geral', RelatorioGeralViewSet, basename='relatorio-geral')

urlpatterns = [
    path('', include(router.urls)),
]
