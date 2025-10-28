import requests
from typing import Optional, Dict


class CEPService:
    """Serviço para consulta de CEP via ViaCEP"""
    
    BASE_URL = "https://viacep.com.br/ws"
    
    @staticmethod
    def consultar_cep(cep: str) -> Optional[Dict]:
        """
        Consulta dados do CEP na API ViaCEP
        
        Args:
            cep: CEP no formato 12345678 ou 12345-678
            
        Returns:
            Dict com dados do endereço ou None se não encontrado
        """
        # Remove caracteres não numéricos
        cep_limpo = ''.join(filter(str.isdigit, cep))
        
        if len(cep_limpo) != 8:
            return None
        
        try:
            response = requests.get(
                f"{CEPService.BASE_URL}/{cep_limpo}/json/",
                timeout=5
            )
            
            if response.status_code == 200:
                dados = response.json()
                
                # Verifica se o CEP existe (API retorna erro:true se não existir)
                if dados.get('erro'):
                    return None
                
                return {
                    'cep': dados.get('cep'),
                    'logradouro': dados.get('logradouro'),
                    'complemento': dados.get('complemento'),
                    'bairro': dados.get('bairro'),
                    'cidade': dados.get('localidade'),
                    'estado': dados.get('uf'),
                }
            
            return None
            
        except requests.exceptions.RequestException as e:
            print(f"Erro ao consultar CEP: {e}")
            return None


cep_service = CEPService()