from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet, consultar_cep

router = DefaultRouter()
router.register(r'', ClienteViewSet, basename='cliente')

urlpatterns = [
    path('cep/', consultar_cep, name='consultar_cep'),
    path('', include(router.urls)),
]