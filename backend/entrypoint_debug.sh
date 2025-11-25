#!/bin/bash

echo "Aguardando MySQL estar pronto..."
python << END
import time
import pymysql
import os

for i in range(30):
    try:
        conn = pymysql.connect(
            host=os.getenv('DATABASE_HOST', 'db'),
            user=os.getenv('DATABASE_USER', 'root'),
            password=os.getenv('DATABASE_PASSWORD', '12345678'),
            port=int(os.getenv('DATABASE_PORT', '3306'))
        )
        conn.close()
        print("MySQL está pronto!")
        break
    except:
        print(f"Tentativa {i+1}/30 - MySQL não está pronto ainda...")
        time.sleep(1)
END

echo "Verificando modelo DocumentoFornecedor..."
python << END
import os
import sys
import django

# Adiciona o diretório do projeto ao path
sys.path.insert(0, '/app')

# Configura o Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'projeto.settings')
django.setup()

try:
    from produtos.models import DocumentoFornecedor
    print("✓ Modelo DocumentoFornecedor importado com sucesso!")
    print(f"✓ Tabela: {DocumentoFornecedor._meta.db_table}")
except ImportError as e:
    print(f"✗ Erro ao importar DocumentoFornecedor: {e}")
    
    # Verifica todos os modelos disponíveis
    from produtos.models import *
    print("\\nModelos disponíveis em produtos.models:")
    for name in dir():
        if not name.startswith('_') and name[0].isupper():
            obj = globals()[name]
            if hasattr(obj, '_meta') and hasattr(obj._meta, 'model_name'):
                print(f"  - {name}")
END

echo "Iniciando servidor Django..."
exec "$@"