from django.urls import path
from .views import FuncionarioCreateView, LoginView

urlpatterns = [
    path('register/', FuncionarioCreateView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
]
