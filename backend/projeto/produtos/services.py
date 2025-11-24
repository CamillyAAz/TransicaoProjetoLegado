from django.db import transaction
from django.core.exceptions import ValidationError

from .models import Produto, MovimentacaoEstoque


def ajustar_estoque(*, produto: Produto, tipo: str, quantidade: int, funcionario=None, observacao: str = "") -> MovimentacaoEstoque:
    """

    - Valida quantidade > 0
    - Valida estoque suficiente para saídas
    - Atualiza `produto.qtd_estoque`
    - Registra `MovimentacaoEstoque`

    Retorna a instância de `MovimentacaoEstoque` criada.
    """

    if quantidade is None or quantidade <= 0:
        raise ValidationError({"quantidade": "Quantidade deve ser maior que zero."})

    if tipo not in ("ENTRADA", "SAIDA"):
        raise ValidationError({"tipo": "Tipo deve ser ENTRADA ou SAIDA."})

    with transaction.atomic():
        if tipo == "SAIDA":
            if produto.qtd_estoque < quantidade:
                raise ValidationError({"quantidade": "Estoque insuficiente para saída."})
            novo_estoque = produto.qtd_estoque - quantidade
        else:  # ENTRADA
            novo_estoque = produto.qtd_estoque + quantidade

        produto.qtd_estoque = novo_estoque
        produto.save(update_fields=["qtd_estoque"])

        movimentacao = MovimentacaoEstoque.objects.create(
            produto=produto,
            tipo=tipo,
            quantidade=quantidade,
            funcionario=funcionario,
            observacao=observacao or ""
        )

        return movimentacao