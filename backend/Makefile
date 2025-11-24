.PHONY: help build up down logs restart shell migrate test createsuperuser clean backup

help: 
	@echo "Comandos disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Build das imagens Docker
	docker-compose build

up: ## Sobe os containers
	docker-compose up -d

down: ## Para os containers
	docker-compose down

logs: ## Mostra logs em tempo real
	docker-compose logs -f

restart: ## Reinicia os containers
	docker-compose down && docker-compose up -d

shell: ## Abre shell Python/Django
	docker-compose exec web python manage.py shell

bash: ## Abre bash no container
	docker-compose exec web bash

migrate: ## Aplica migrations
	docker-compose exec web python manage.py migrate

makemigrations: ## Cria migrations
	docker-compose exec web python manage.py makemigrations

test: ## Roda testes
	docker-compose exec web python manage.py test

createsuperuser: ## Cria superuser
	docker-compose exec web python manage.py createsuperuser

clean: ## Remove containers, volumes e imagens
	docker-compose down -v
	docker system prune -f

reset: ## Reseta TUDO e sobe de novo
	docker-compose down -v
	docker-compose up -d
	@echo "Aguardando MySQL..."
	@sleep 10
	docker-compose exec web python manage.py migrate

backup: ## Faz backup do banco
	docker-compose exec db mysqldump -u root -p12345678 bdvendas > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Backup criado!"

install: ## Setup inicial completo
	docker-compose build
	docker-compose up -d
	@echo "Aguardando MySQL..."
	@sleep 15
	docker-compose exec web python manage.py migrate
	@echo "✅ Setup completo! Acesse: http://localhost:8000/api/docs/"
