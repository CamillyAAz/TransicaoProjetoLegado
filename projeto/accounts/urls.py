from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FuncionarioViewSet, FuncionarioCreateView, LoginView

router = DefaultRouter()
router.register(r'funcionarios', FuncionarioViewSet, basename='funcionario')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', FuncionarioCreateView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
]
