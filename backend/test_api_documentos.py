import os
import sys
import django
import requests
import json

# Configuração do Django
sys.path.insert(0, 'C:/Users/Amanda/projects/LEGADO/TransicaoProjetoLegado/projeto')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'projeto.settings')
django.setup()

# Testar a criação de um documento via API
print("=== Teste de API de Documentos de Fornecedor ===")

# URL base da API
base_url = "http://localhost:8000/api"

# Fazer login para obter token
try:
    login_data = {
        "username": "admin@example.com",
        "password": "admin123"
    }
    
    response = requests.post(f"{base_url}/token/", json=login_data)
    if response.status_code == 200:
        token = response.json()['access']
        print("✓ Login realizado com sucesso")
        print(f"✓ Token obtido: {token[:20]}...")
        
        # Headers com token
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        # Testar listagem de documentos
        print("\n=== Testando listagem de documentos ===")
        response = requests.get(f"{base_url}/documentos-fornecedor/", headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("✓ API de documentos está acessível")
            documentos = response.json()
            print(f"Documentos encontrados: {len(documentos)}")
        else:
            print(f"✗ Erro ao acessar API: {response.text}")
            
    else:
        print(f"✗ Erro no login: {response.status_code}")
        print(response.text)
        
except requests.exceptions.ConnectionError:
    print("✗ Não foi possível conectar ao servidor Django")
    print("  Certifique-se de que o servidor está rodando em localhost:8000")
except Exception as e:
    print(f"✗ Erro inesperado: {e}")

print("\n=== Teste finalizado ===")