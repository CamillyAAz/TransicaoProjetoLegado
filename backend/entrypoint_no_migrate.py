#!/usr/bin/env python3
import time
import pymysql
import os
import subprocess
import sys

def wait_for_mysql():
    """Aguarda o MySQL ficar disponível"""
    print("Aguardando MySQL estar pronto...")
    
    host = os.getenv('DATABASE_HOST', 'db')
    user = os.getenv('DATABASE_USER', 'root')
    password = os.getenv('DATABASE_PASSWORD', '12345678')
    port = int(os.getenv('DATABASE_PORT', '3306'))
    
    for i in range(30):
        try:
            conn = pymysql.connect(
                host=host,
                user=user,
                password=password,
                port=port
            )
            conn.close()
            print("MySQL está pronto!")
            return True
        except Exception as e:
            print(f"Tentativa {i+1}/30 - MySQL não está pronto ainda... ({e})")
            time.sleep(1)
    
    print("ERRO: MySQL não ficou disponível após 30 tentativas")
    sys.exit(1)

def start_server():
    """Inicia o servidor Django"""
    print("Iniciando servidor Django...")
    os.execvp(sys.argv[1], sys.argv[1:])

if __name__ == '__main__':
    wait_for_mysql()
    start_server()