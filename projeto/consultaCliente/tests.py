from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from clientes.models import Cliente

User = get_user_model()


class ConsultaClienteAPITestCase(APITestCase):
    def setUp(self):
        # Criar usuário para autenticação
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            nome='Test User'
        )
        
        # Criar clientes de teste
        self.cliente1 = Cliente.objects.create(
            nome='João Silva',
            cpf='12345678901',
            email='joao@email.com',
            telefone='11999999999',
            celular='11988888888',
            cidade='São Paulo',
            estado='SP'
        )
        
        self.cliente2 = Cliente.objects.create(
            nome='Maria Santos',
            cpf='98765432100',
            email='maria@email.com',
            telefone='11888888888',
            celular='11777777777',
            cidade='Rio de Janeiro',
            estado='RJ'
        )
        
        # Autenticar usuário
        self.client.force_authenticate(user=self.user)

    def test_listar_clientes(self):
        """Testa listagem de clientes"""
        url = reverse('consulta-cliente-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_buscar_por_cpf(self):
        """Testa busca por CPF"""
        url = reverse('consulta-cliente-buscar-por-cpf')
        response = self.client.get(url, {'cpf': '12345678901'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nome'], 'João Silva')

    def test_buscar_por_cpf_nao_encontrado(self):
        """Testa busca por CPF inexistente"""
        url = reverse('consulta-cliente-buscar-por-cpf')
        response = self.client.get(url, {'cpf': '00000000000'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_buscar_por_nome(self):
        """Testa busca por nome"""
        url = reverse('consulta-cliente-buscar-por-nome')
        response = self.client.get(url, {'nome': 'João'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['nome'], 'João Silva')

    def test_buscar_por_cidade(self):
        """Testa busca por cidade"""
        url = reverse('consulta-cliente-buscar-por-cidade')
        response = self.client.get(url, {'cidade': 'São Paulo'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['cidade'], 'São Paulo')

    def test_buscar_por_estado(self):
        """Testa busca por estado"""
        url = reverse('consulta-cliente-buscar-por-estado')
        response = self.client.get(url, {'estado': 'SP'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['estado'], 'SP')

    def test_buscar_por_email(self):
        """Testa busca por email"""
        url = reverse('consulta-cliente-buscar-por-email')
        response = self.client.get(url, {'email': 'joao@email.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nome'], 'João Silva')

    def test_buscar_por_telefone(self):
        """Testa busca por telefone"""
        url = reverse('consulta-cliente-buscar-por-telefone')
        response = self.client.get(url, {'telefone': '11999999999'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['nome'], 'João Silva')

    def test_estatisticas(self):
        """Testa endpoint de estatísticas"""
        url = reverse('consulta-cliente-estatisticas')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_clientes'], 2)
        self.assertEqual(response.data['estados_distintos'], 2)
        self.assertEqual(response.data['cidades_distintas'], 2)

    def test_detalhado(self):
        """Testa endpoint de detalhes completos"""
        url = reverse('consulta-cliente-detalhado', kwargs={'pk': self.cliente1.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nome'], 'João Silva')
        # Verifica se todos os campos estão presentes
        self.assertIn('rg', response.data)
        self.assertIn('endereco', response.data)
        self.assertIn('bairro', response.data)

    def test_autenticacao_obrigatoria(self):
        """Testa se autenticação é obrigatória"""
        self.client.force_authenticate(user=None)
        url = reverse('consulta-cliente-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_filtros_e_busca(self):
        """Testa funcionalidades de filtro e busca"""
        # Teste de busca geral
        url = reverse('consulta-cliente-list')
        response = self.client.get(url, {'search': 'João'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        
        # Teste de filtro por estado
        response = self.client.get(url, {'estado': 'SP'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        
        # Teste de ordenação
        response = self.client.get(url, {'ordering': 'nome'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'][0]['nome'], 'João Silva')
