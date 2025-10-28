# Use Python 3.13 oficial
FROM python:3.13-slim

# Define variáveis de ambiente
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Define o diretório de trabalho
WORKDIR /app

# Instala dependências do sistema necessárias para MySQL
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copia arquivo de requirements
COPY requirements.txt /app/

# Instala dependências Python
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copia o projeto
COPY ./projeto /app/

# Expõe a porta 8000
EXPOSE 8000

# Comando padrão
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
