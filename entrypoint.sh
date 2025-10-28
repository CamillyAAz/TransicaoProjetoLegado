
echo "Aguardando MySQL estar pronto..."
while ! nc -z db 3306; do
  sleep 0.5
done
echo "MySQL está pronto!"

echo "Aplicando migrations..."
python manage.py migrate --noinput

echo "Iniciando servidor Django..."
exec "$@"
