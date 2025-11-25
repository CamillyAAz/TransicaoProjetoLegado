# 🎯 Setup Ultra Rápido

## Com Make (MAIS FÁCIL!)

```bash
# Setup inicial completo
make install

# Comandos diários
make up          # Subir
make logs        # Ver logs
make down        # Parar
make restart     # Reiniciar
make shell       # Shell Django
make test        # Rodar testes
make reset       # Resetar tudo

# Ver todos os comandos
make help
```

## Sem Make (Docker puro)

```bash
# Setup inicial
docker-compose build
docker-compose up -d

# Aguardar 10 segundos...
docker-compose exec web python manage.py migrate
```

## Acessar

- **Swagger**: http://localhost:8000/api/docs/
- **Admin**: http://localhost:8000/admin/

## Criar usuário admin

```bash
make createsuperuser
# Ou
docker-compose exec web python manage.py createsuperuser
```

## Problemas?

```bash
# Ver o que está acontecendo
make logs

# Resetar tudo
make reset
```

---

**Só isso! Agora é só codar! 🚀**
