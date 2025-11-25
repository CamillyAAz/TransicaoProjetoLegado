import os
import sys
import django

# Adiciona o diretório do projeto ao path
sys.path.insert(0, '/app')

# Configura o Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'projeto.settings')
django.setup()

# Agora tenta importar o modelo
try:
    from produtos.models import DocumentoFornecedor
    print("✓ Modelo DocumentoFornecedor importado com sucesso!")
    print(f"✓ Tabela: {DocumentoFornecedor._meta.db_table}")
except ImportError as e:
    print(f"✗ Erro ao importar DocumentoFornecedor: {e}")

# Verifica todos os modelos disponíveis
from produtos.models import *
print("\nModelos disponíveis em produtos.models:")
for name in dir():
    if not name.startswith('_') and name[0].isupper():
        obj = globals()[name]
        if hasattr(obj, '_meta') and hasattr(obj._meta, 'model_name'):
            print(f"  - {name}")