from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from rest_framework import routers
from produtos.views import ProdutoViewSet, FornecedorViewSet, MovimentacaoEstoqueViewSet
from vendas.views import VendaViewSet
from accounts.views import FuncionarioCreateView
from fornecedores.views import FornecedorViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

router = routers.DefaultRouter()
router.register(r'produtos', ProdutoViewSet, basename='produto')
router.register(r'fornecedores', FornecedorViewSet, basename='fornecedor')
router.register(r'movimentacoes', MovimentacaoEstoqueViewSet, basename='movimentacao')
router.register(r'vendas', VendaViewSet, basename='venda')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema')),
    path('', TemplateView.as_view(template_name='index.html')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)