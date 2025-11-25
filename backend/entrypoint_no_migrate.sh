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

echo "Iniciando servidor Django..."
exec "$@"