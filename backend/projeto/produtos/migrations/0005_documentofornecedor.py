# Generated manually for DocumentoFornecedor model

from django.db import migrations, models
import django.db.models.deletion


def fornecedor_documento_path(instance, filename):
    """Define o caminho para upload de documentos de fornecedores"""
    return f'fornecedores/{instance.fornecedor.id}/documentos/{filename}'


class Migration(migrations.Migration):

    dependencies = [
        ('produtos', '0003_alter_produto_fornecedor'),
    ]

    operations = [
        migrations.CreateModel(
            name='DocumentoFornecedor',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('titulo', models.CharField(max_length=200)),
                ('tipo', models.CharField(choices=[('CONTRATO', 'Contrato'), ('CERTIFICADO', 'Certificado'), ('NOTA_FISCAL', 'Nota Fiscal'), ('CERTIDAO', 'Certidão'), ('OUTRO', 'Outro')], default='OUTRO', max_length=20)),
                ('arquivo', models.FileField(upload_to=fornecedor_documento_path)),
                ('descricao', models.TextField(blank=True, null=True)),
                ('data_upload', models.DateTimeField(auto_now_add=True)),
                ('tamanho_arquivo', models.BigIntegerField(blank=True, null=True)),
                ('fornecedor', models.ForeignKey(db_column='for_id', on_delete=django.db.models.deletion.CASCADE, related_name='documentos', to='produtos.fornecedor')),
            ],
            options={
                'db_table': 'tb_documentos_fornecedor',
                'managed': True,
                'verbose_name': 'Documento do Fornecedor',
                'verbose_name_plural': 'Documentos do Fornecedor',
            },
        ),
    ]