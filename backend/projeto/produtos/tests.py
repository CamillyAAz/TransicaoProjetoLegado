from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from decimal import Decimal
from accounts.models import Funcionario
from .models import Fornecedor, Produto
from .serializers import FornecedorSerializer, ProdutoSerializer


class FornecedorModelTest(TestCase):
    
    def setUp(self):
        self.fornecedor = Fornecedor.objects.create(
            nome="Fornecedor Teste",
            cnpj="12345678901234",
            email="teste@fornecedor.com",
            telefone="(11) 1234-5678",
            celular="(11) 98765-4321",
            cep="01234-567",
            endereco="Rua Teste",
            numero=123,
            complemento="Sala 1",
            bairro="Centro",
            cidade="São Paulo",
            estado="SP"
        )

    def test_fornecedor_creation(self):
        self.assertEqual(self.fornecedor.nome, "Fornecedor Teste")
        self.assertEqual(self.fornecedor.cnpj, "12345678901234")
        self.assertEqual(self.fornecedor.email, "teste@fornecedor.com")
        self.assertEqual(self.fornecedor.cidade, "São Paulo")
        self.assertEqual(self.fornecedor.estado, "SP")
        
    def test_fornecedor_str(self):
        self.assertEqual(str(self.fornecedor), "Fornecedor Teste")
        
    def test_fornecedor_db_table(self):
        self.assertEqual(Fornecedor._meta.db_table, 'tb_fornecedores')


class ProdutoModelTest(TestCase):
    
    def setUp(self):
        self.fornecedor = Fornecedor.objects.create(
            nome="Fornecedor Teste"
        )
        self.produto = Produto.objects.create(
            descricao="Produto Teste",
            preco=Decimal("100.50"),
            qtd_estoque=50,
            fornecedor=self.fornecedor
        )

    def test_produto_creation(self):
        self.assertEqual(self.produto.descricao, "Produto Teste")
        self.assertEqual(self.produto.preco, Decimal("100.50"))
        self.assertEqual(self.produto.qtd_estoque, 50)
        self.assertEqual(self.produto.fornecedor, self.fornecedor)
        
    def test_produto_str(self):
        self.assertEqual(str(self.produto), "Produto Teste")
        
    def test_produto_db_table(self):
        self.assertEqual(Produto._meta.db_table, 'tb_produtos')
        
    def test_produto_foreign_key(self):
        self.assertEqual(self.produto.fornecedor.nome, "Fornecedor Teste")
        self.assertIn(self.produto, self.fornecedor.produtos.all())


class FornecedorSerializerTest(TestCase):
    
    def setUp(self):
        self.fornecedor_data = {
            'nome': 'Fornecedor Serializer',
            'cnpj': '11223344556677',
            'email': 'serializer@teste.com',
            'cidade': 'Rio de Janeiro',
            'estado': 'RJ'
        }
        
    def test_serializer_with_valid_data(self):
        """Testa serializer com dados válidos"""
        serializer = FornecedorSerializer(data=self.fornecedor_data)
        self.assertTrue(serializer.is_valid())
        
    def test_serializer_create(self):
        """Testa criação via serializer"""
        serializer = FornecedorSerializer(data=self.fornecedor_data)
        self.assertTrue(serializer.is_valid())
        fornecedor = serializer.save()
        self.assertEqual(fornecedor.nome, 'Fornecedor Serializer')


class ProdutoSerializerTest(TestCase):
    """Testa o serializer de Produto"""
    
    def setUp(self):
        self.fornecedor = Fornecedor.objects.create(nome="Fornecedor Teste")
        self.produto_data = {
            'descricao': 'Produto Serializer',
            'preco': '99.90',
            'qtd_estoque': 10,
            'fornecedor': self.fornecedor.id
        }
        
    def test_serializer_with_valid_data(self):
        """Testa serializer com dados válidos"""
        serializer = ProdutoSerializer(data=self.produto_data)
        self.assertTrue(serializer.is_valid())
        
    def test_serializer_negative_price(self):
        """Testa validação de preço negativo"""
        data = self.produto_data.copy()
        data['preco'] = '-10.00'
        serializer = ProdutoSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('preco', serializer.errors)
        
    def test_serializer_negative_stock(self):
        """Testa validação de estoque negativo"""
        data = self.produto_data.copy()
        data['qtd_estoque'] = -5
        serializer = ProdutoSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('qtd_estoque', serializer.errors)
        
    def test_serializer_includes_fornecedor_nome(self):
        """Testa se inclui o nome do fornecedor na serialização"""
        produto = Produto.objects.create(**{
            'descricao': 'Produto Teste',
            'preco': '50.00',
            'qtd_estoque': 20,
            'fornecedor': self.fornecedor
        })
        serializer = ProdutoSerializer(produto)
        self.assertIn('fornecedor_nome', serializer.data)
        self.assertEqual(serializer.data['fornecedor_nome'], 'Fornecedor Teste')



class FornecedorAPITest(APITestCase):
    """Testa a API de Fornecedores"""
    
    def setUp(self):
        self.user = Funcionario.objects.create_user(
            email='teste@teste.com',
            password='senha123',
            nome='Usuário Teste'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
        self.fornecedor = Fornecedor.objects.create(
            nome="Fornecedor API",
            cnpj="99887766554433",
            email="api@fornecedor.com"
        )
        
    def test_list_fornecedores(self):
        """Testa listagem de fornecedores"""
        url = reverse('fornecedor-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)
        
    def test_create_fornecedor(self):
        """Testa criação de fornecedor"""
        url = reverse('fornecedor-list')
        data = {
            'nome': 'Novo Fornecedor',
            'cnpj': '11111111111111',
            'email': 'novo@fornecedor.com'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Fornecedor.objects.count(), 2)
        
    def test_retrieve_fornecedor(self):
        """Testa busca de fornecedor específico"""
        url = reverse('fornecedor-detail', kwargs={'pk': self.fornecedor.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nome'], 'Fornecedor API')
        
    def test_update_fornecedor(self):
        """Testa atualização completa de fornecedor"""
        url = reverse('fornecedor-detail', kwargs={'pk': self.fornecedor.pk})
        data = {
            'nome': 'Fornecedor Atualizado',
            'cnpj': '99887766554433',
            'email': 'atualizado@fornecedor.com'
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.fornecedor.refresh_from_db()
        self.assertEqual(self.fornecedor.nome, 'Fornecedor Atualizado')
        
    def test_partial_update_fornecedor(self):
        """Testa atualização parcial de fornecedor"""
        url = reverse('fornecedor-detail', kwargs={'pk': self.fornecedor.pk})
        data = {'nome': 'Nome Parcialmente Atualizado'}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.fornecedor.refresh_from_db()
        self.assertEqual(self.fornecedor.nome, 'Nome Parcialmente Atualizado')
        
    def test_delete_fornecedor(self):
        """Testa exclusão de fornecedor"""
        url = reverse('fornecedor-detail', kwargs={'pk': self.fornecedor.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Fornecedor.objects.count(), 0)
        
    def test_search_fornecedor(self):
        """Testa busca por nome"""
        url = reverse('fornecedor-list')
        response = self.client.get(url, {'search': 'API'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)
        
    def test_filter_by_estado(self):
        """Testa filtro por estado"""
        Fornecedor.objects.create(nome="Fornecedor SP", estado="SP")
        url = reverse('fornecedor-list')
        response = self.client.get(url, {'estado': 'SP'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_unauthorized_access(self):
        """Testa acesso sem autenticação"""
        self.client.force_authenticate(user=None)
        url = reverse('fornecedor-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ProdutoAPITest(APITestCase):
    """Testa a API de Produtos"""
    
    def setUp(self):
        self.user = Funcionario.objects.create_user(
            email='teste@teste.com',
            password='senha123',
            nome='Usuário Teste'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
        self.fornecedor = Fornecedor.objects.create(
            nome="Fornecedor Teste"
        )
        
        self.produto = Produto.objects.create(
            descricao="Produto API",
            preco=Decimal("150.00"),
            qtd_estoque=30,
            fornecedor=self.fornecedor
        )
        
    def test_list_produtos(self):
        """Testa listagem de produtos"""
        url = reverse('produto-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)
        
    def test_create_produto(self):
        """Testa criação de produto"""
        url = reverse('produto-list')
        data = {
            'descricao': 'Novo Produto',
            'preco': '200.00',
            'qtd_estoque': 15,
            'fornecedor': self.fornecedor.id
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Produto.objects.count(), 2)
        
    def test_create_produto_invalid_price(self):
        """Testa criação com preço inválido"""
        url = reverse('produto-list')
        data = {
            'descricao': 'Produto Inválido',
            'preco': '-50.00',
            'qtd_estoque': 10,
            'fornecedor': self.fornecedor.id
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_create_produto_invalid_stock(self):
        """Testa criação com estoque inválido"""
        url = reverse('produto-list')
        data = {
            'descricao': 'Produto Inválido',
            'preco': '50.00',
            'qtd_estoque': -10,
            'fornecedor': self.fornecedor.id
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_retrieve_produto(self):
        """Testa busca de produto específico"""
        url = reverse('produto-detail', kwargs={'pk': self.produto.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['descricao'], 'Produto API')
        self.assertIn('fornecedor_nome', response.data)
        
    def test_update_produto(self):
        """Testa atualização completa de produto"""
        url = reverse('produto-detail', kwargs={'pk': self.produto.pk})
        data = {
            'descricao': 'Produto Atualizado',
            'preco': '250.00',
            'qtd_estoque': 40,
            'fornecedor': self.fornecedor.id
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.produto.refresh_from_db()
        self.assertEqual(self.produto.descricao, 'Produto Atualizado')
        self.assertEqual(self.produto.preco, Decimal("250.00"))
        
    def test_partial_update_produto(self):
        """Testa atualização parcial de produto (apenas estoque)"""
        url = reverse('produto-detail', kwargs={'pk': self.produto.pk})
        data = {'qtd_estoque': 100}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.produto.refresh_from_db()
        self.assertEqual(self.produto.qtd_estoque, 100)
        
    def test_delete_produto(self):
        """Testa exclusão de produto"""
        url = reverse('produto-detail', kwargs={'pk': self.produto.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Produto.objects.count(), 0)
        
    def test_search_produto(self):
        """Testa busca por descrição"""
        url = reverse('produto-list')
        response = self.client.get(url, {'search': 'API'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)
        
    def test_filter_by_fornecedor(self):
        """Testa filtro por fornecedor"""
        url = reverse('produto-list')
        response = self.client.get(url, {'fornecedor': self.fornecedor.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_ordering_by_price(self):
        """Testa ordenação por preço"""
        Produto.objects.create(
            descricao="Produto Barato",
            preco=Decimal("10.00"),
            qtd_estoque=5,
            fornecedor=self.fornecedor
        )
        url = reverse('produto-list')
        response = self.client.get(url, {'ordering': 'preco'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_pagination(self):
        """Testa paginação"""
        # Criar mais produtos
        for i in range(15):
            Produto.objects.create(
                descricao=f"Produto {i}",
                preco=Decimal("50.00"),
                qtd_estoque=10,
                fornecedor=self.fornecedor
            )
        url = reverse('produto-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertIn('count', response.data)
        self.assertEqual(len(response.data['results']), 10)  # PAGE_SIZE = 10
        
    def test_unauthorized_access(self):
        """Testa acesso sem autenticação"""
        self.client.force_authenticate(user=None)
        url = reverse('produto-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
