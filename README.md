Sistema de Vendas Web

Este repositório contém o backend (Django) e o frontend (React + Vite) do sistema.

Este README mostra como configurar e executar o projeto localmente no Windows PowerShell.

Sumário
- Desenvolvimento (Windows PowerShell)
- Build para produção (servir via Django)
- Dicas de troubleshooting

Desenvolvimento (Windows PowerShell)

Pré-requisitos:
- Python 3.10+
- Node.js + npm
- MySQL acessível conforme configuração

Backend (Django)

Exemplos assumem que você está na raiz do repositório C:\Users\camil\Desktop\TransicaoProjetoLegado.

1) Criar/ativar venv (exemplo):

```powershell
python -m venv venv

.\venv\Scripts\Activate.ps1
```

2) Instalar dependências do backend

```powershell
cd projeto\backend
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

3) Configurar banco (edite projeto/projeto/settings.py ou use variáveis de ambiente)

4) Rodar migrações e criar superusuário

```powershell
python manage.py migrate
python manage.py createsuperuser
```

5) Rodar servidor Django

```powershell
python manage.py runserver 8000
```

Se aparecer erro de módulo faltando (ex.: pymysql, corsheaders), instale os pacotes faltantes:

```powershell
python -m pip install PyMySQL django-cors-headers
```

Frontend (Vite / React)

1) Instalar dependências e axios

```powershell
cd frontend\nova-admin-grid
npm install
npm install axios
```

2) Rodar em dev apontando para a API local

```powershell
$env:VITE_API_URL = 'http://127.0.0.1:8000/api/'
npm run dev
```

Build para produção (servir via Django)

1) Gerar build do frontend

```powershell
cd frontend\nova-admin-grid
npm run build
```

2) Copiar index.html para as templates e assets para staticfiles

```powershell
copy .\dist\index.html ..\..\projeto\backend\templates\
robocopy .\dist\assets ..\..\projeto\backend\staticfiles\assets /E
```

3) Coletar estáticos e rodar Django

```powershell
cd ..\..\projeto\backend
python manage.py collectstatic --noinput
python manage.py runserver 8000
```

URLs úteis

- API root: http://127.0.0.1:8000/api/
- API docs (se habilitado): http://127.0.0.1:8000/api/docs/
- Frontend dev: http://127.0.0.1:5173/

Dicas de troubleshooting

- Use where python e python -m pip --version para confirmar que o pip pertence ao Python/venv correto.
- Se os assets não carregarem, verifique se os arquivos do dist/assets foram copiados para projeto/backend/staticfiles/assets e se index.html referencia os caminhos corretos.
- Para problemas de CORS em dev, adicione http://localhost:5173 e http://127.0.0.1:5173 em CORS_ALLOWED_ORIGINS no settings.py.

Se quiser, eu crio um setup.ps1 que automatize estes passos de criação/ativação do venv e instalação de dependências.
# Sistema de Vendas Web

Este projeto é a migração de um sistema de vendas **desktop**, originalmente desenvolvido em **Java Swing**, para uma arquitetura **web moderna**.  
A nova aplicação é dividida em duas camadas principais, facilitando o desenvolvimento e o deploy independentes: **Backend** e **Frontend**.

---

## � Quick Start com Docker (RECOMENDADO!)

**A forma mais rápida de rodar o projeto completo:**

```bash
# 1. Build das imagens
docker-compose build

# 2. Sobe os containers (Django + MySQL)
docker-compose up -d

# 3. Acessa a aplicação
open http://localhost:8000/api/docs/

docker-compose down -v && docker-compose build --no-cache && docker-compose up -d
```

**Pronto! Sistema rodando em 3 comandos! 🎉**

📖 **Documentação completa**: [`DOCKER_README.md`](./DOCKER_README.md)

---

## �📌 Visão Geral da Arquitetura

O sistema é construído com as seguintes tecnologias:

- **Frontend**: Uma Single-Page Application (SPA) desenvolvida com **React**, responsável pela interface do usuário e interação no navegador.  
- **Backend**: Uma API RESTful desenvolvida com **Django** e **Django REST Framework**, que lida com a lógica de negócio, segurança e comunicação com o banco de dados.  
- **Banco de Dados**: **MySQL** para a persistência dos dados.

---

## 📂 Estrutura do Projeto

A raiz do projeto está organizada para separar as duas camadas da aplicação:

```bash
/sistema-vendas-web/
|-- backend/ # Contém o projeto Django (API)
| |-- apivendas/
| |-- clientes/
| |-- produtos/
| |-- funcionarios/
| |-- vendas/
|
|-- frontend/ # Contém o projeto React (UI)
| |-- public/
| |-- src/
| | |-- assets/
| | |-- components/
| | |-- pages/
| | |-- services/
| | |-- ...
| |-- ...
|
|-- README.md

````
---

## ⚙️ Backend (Django)

O backend segue a estrutura padrão de um projeto Django, modularizando o sistema em **apps** reutilizáveis para cada funcionalidade:

- **apivendas/** → Configurações principais do projeto Django.  
- **clientes/**, **produtos/**, **funcionarios/**, **vendas/** → Apps específicos com:
  - `models.py` → Mapeamento das tabelas.  
  - `serializers.py` → Conversão para JSON.  
  - `views.py` → Lógica dos endpoints.  
  - `urls.py` → Rotas da API.  

---

## 🎨 Frontend (React)

O frontend é estruturado com **componentes, páginas e serviços**, mantendo o código organizado e escalável:

- `src/components/` → Componentes de UI reutilizáveis (botões, modais, sidebar etc).  
- `src/pages/` → Páginas completas do sistema (ex: `TelaLogin.js`, `TelaClientes.js`).  
- `src/services/` → Comunicação com a API (requisições HTTP).  

---

## 🚀 Como Rodar o Projeto

### ✅ Pré-requisitos

- Python 3.x  
- Node.js + npm  
- MySQL  

---

### 🔹 Backend

1. Navegue até o diretório `backend/`.  
2. Crie e ative um **ambiente virtual**.  
3. Instale as dependências:  
   ```bash
   pip install -r requirements.txt
4. Configure as credenciais do banco de dados em apivendas/settings.py.
5. Aplique as migrações:
    ```bash
    python manage.py migrate
6. Inicie o servidor de desenvolvimento:
    ```bash
   python manage.py runserver

---

### 🔹 Frontend

1. Navegue até o diretório frontend/.
2. Instale as dependências:
   ```bash
   npm install
3. Inicie a aplicação:
  ```bash
  npm start

