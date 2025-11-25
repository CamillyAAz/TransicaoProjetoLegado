import requests
import re
from datetime import datetime
from django.conf import settings


class WhatsAppNotificationService:
    def __init__(self):
        self.api_url = 'https://api.staging.naty.app/api/v2/campaigns/'
        self.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJjcmVhdGU6bWVzc2FnZXMiLCJyZWFkOndoYXRzYXBwcyIsInJlYWQ6Y2FtcGFpZ25zIiwicmVhZDpjaGFubmVscyIsInJlYWQ6dXNlcnMiLCJyZWFkOnF1ZXVlcyIsIm1hbmFnZTpjYW1wYWlnbnMiLCJ1cGRhdGU6d2hhdHNhcHBzIiwiY3JlYXRlOm1lZGlhcyJdLCJjb21wYW55SWQiOiI0MTJiMDIyYS0yMjQ2LTQxN2ItYTJhMy00NjQ4MDJhZDE3NTQiLCJpYXQiOjE3NTEwMzE3Nzh9.hWMrCrgWPDQPTM9JvKkROE6NWRy6zP67-F0qafoUSOA'
        self.whatsapp_id = '13b0c0a1-c853-40ae-8c02-7a28e65710db'
        self.queue_id = '167b95dc-e587-4979-b1a7-450a89c229db'

    def send_message(self, phone_number, message, campaign_name='Notificação Sistema'):
        try:
            payload = {
                'name': campaign_name,
                'whatsappId': self.whatsapp_id,
                'queueId': self.queue_id,
                'messages': [
                    {
                        'number': phone_number,
                        'body': message
                    }
                ]
            }

            headers = {
                'Authorization': f'Bearer {self.token}',
                'Content-Type': 'application/json'
            }

            response = requests.post(self.api_url, json=payload, headers=headers)
            response.raise_for_status()
            
            print(f'Mensagem WhatsApp enviada: {response.json()}')
            return response.json()
        except requests.exceptions.RequestException as error:
            print(f'Erro ao enviar mensagem WhatsApp: {error}')
            raise error

    def notify_new_product(self, cliente, produto):
        message = (
            f"🛍️ *NOVO PRODUTO DISPONÍVEL*\n\n"
            f"Olá {cliente.nome}!\n\n"
            f"Temos um novo produto disponível:\n"
            f"📦 Produto: {produto.descricao}\n"
            f"💰 Preço: R$ {produto.preco}\n"
            f"📊 Em estoque: {produto.qtd_estoque} unidades\n\n"
            f"Aproveite!"
        )

        return self.send_message(
            self.format_phone_number(cliente.celular or '5545999999999'),
            message,
            'Novo Produto'
        )

    def notify_low_stock(self, produto, fornecedor):
        message = (
            f"⚠️ *ESTOQUE BAIXO*\n\n"
            f"Atenção!\n\n"
            f"O produto está com estoque baixo:\n"
            f"📦 Produto: {produto.descricao}\n"
            f"📊 Estoque atual: {produto.qtd_estoque} unidades\n"
            f"🏭 Fornecedor: {fornecedor.nome}\n\n"
            f"🔔 Considere fazer um novo pedido!"
        )

        return self.send_message(
            self.format_phone_number(fornecedor.celular or '5545999999999'),
            message,
            'Estoque Baixo'
        )

    def notify_order_confirmation(self, cliente, produtos, total):
        produtos_lista = '\n'.join([
            f"• {p['descricao']} (x{p['quantidade']}) - R$ {p['subtotal']}"
            for p in produtos
        ])
        
        message = (
            f"✅ *PEDIDO CONFIRMADO*\n\n"
            f"Olá {cliente.nome}!\n\n"
            f"Seu pedido foi confirmado:\n\n"
            f"{produtos_lista}\n\n"
            f"💰 *Total: R$ {total}*\n\n"
            f"📦 Em breve você receberá seu pedido!"
        )

        return self.send_message(
            self.format_phone_number(cliente.celular or '5545999999999'),
            message,
            'Pedido Confirmado'
        )

    def notify_payment_received(self, cliente, valor):
        message = (
            f"💳 *PAGAMENTO RECEBIDO*\n\n"
            f"Olá {cliente.nome}!\n\n"
            f"Confirmamos o recebimento do seu pagamento:\n"
            f"💰 Valor: R$ {valor}\n"
            f"📅 Data: {datetime.now().strftime('%d/%m/%Y %H:%M')}\n\n"
            f"✅ Obrigado pela preferência!"
        )

        return self.send_message(
            self.format_phone_number(cliente.celular or '5545999999999'),
            message,
            'Pagamento Recebido'
        )

    def notify_user_created(self, funcionario):
        message = (
            f"👤 *CADASTRO REALIZADO*\n\n"
            f"Olá {funcionario.nome}!\n\n"
            f"Seu cadastro foi realizado com sucesso:\n"
            f"📧 Email: {funcionario.email}\n"
            f"💼 Cargo: {funcionario.cargo or 'Não definido'}\n\n"
            f"✅ Bem-vindo ao sistema!"
        )

        return self.send_message(
            self.format_phone_number(funcionario.celular or '5545999999999'),
            message,
            'Cadastro Realizado'
        )

    def format_phone_number(self, phone):
        clean_phone = re.sub(r'\D', '', phone)
        
        if not clean_phone.startswith('55'):
            return '55' + clean_phone
        
        return clean_phone


whatsapp_service = WhatsAppNotificationService()
