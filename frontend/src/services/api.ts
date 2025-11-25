import { apiFetch } from "@/lib/api";

// Types
export interface Cliente {
  id: number;
  nome: string;
  rg?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  celular?: string;
  cep?: string;
  endereco?: string;
  numero?: number;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  senha?: string | null;
}

export interface Funcionario {
  id: number;
  nome: string;
  email: string;
  cargo?: string | null;
  nivel_acesso?: string | null;
  ui_permissoes?: string | null;
  telefone?: string | null;
  celular?: string | null;
  cep?: string | null;
  endereco?: string | null;
  numero?: number | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  rg?: string | null;
  cpf?: string | null;
  is_active?: boolean;
  is_staff?: boolean;
}

export interface Fornecedor {
  id: number;
  nome: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  celular?: string;
  cep?: string;
  endereco?: string;
  numero?: number;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
}

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: string;
  qtd_estoque: number;
  fornecedor: number;
  fornecedor_nome?: string;
}

export interface Venda {
  id: number;
  cliente?: number;
  cliente_nome?: string;
  funcionario: number;
  funcionario_nome?: string;
  data_venda: string;
  total: number;
  status: string;
  observacao?: string;
  itens?: ItemVenda[];
}

export interface ItemVenda {
  id: number;
  venda: number;
  produto: number;
  produto_descricao?: string;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
}

export interface MovimentacaoEstoque {
  id: number;
  produto: number;
  produto_descricao?: string;
  tipo: 'ENTRADA' | 'SAIDA';
  quantidade: number;
  data_movimento: string;
  funcionario: number;
  funcionario_nome?: string;
  observacao?: string;
}

export interface DashboardStats {
  vendasMes: number;
  novosClientes: number;
  totalPedidos: number;
  ticketMedio: number;
  vendasCrescimento: number;
  clientesCrescimento: number;
  atividadesRecentes?: { id: number; data_venda: string; total: number; cliente__nome?: string }[];
}

export interface NotificationItem {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  description: string;
  time: string;
}

// Pagination response
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// API Functions
export const api = {
  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const stats = await apiFetch<DashboardStats>('/relatorios/geral/dashboard/');
    return stats;
  },

  async getVendasGrafico() {
    const vendas = await apiFetch<PaginatedResponse<Venda>>('/vendas/');
    return vendas.results.map(venda => ({
      month: new Date(venda.data_venda).toLocaleDateString('pt-BR', { month: 'short' }),
      value: parseFloat(venda.total.toString())
    }));
  },

  async getNotifications(): Promise<NotificationItem[]> {
    const [produtosResp, vendasResp] = await Promise.all([
      api.getProdutos(1),
      api.getVendas(1),
    ]);
    const lowStock = (produtosResp.results || [])
      .filter((p) => typeof p.qtd_estoque === "number" && p.qtd_estoque <= 5)
      .map((p) => ({
        id: `low_stock_${p.id}`,
        type: "warning" as const,
        title: "Estoque baixo",
        description: `Produto '${p.descricao || p.nome}' com estoque baixo (${p.qtd_estoque})`,
        time: new Date().toISOString(),
      }));
    const sales = (vendasResp.results || [])
      .slice(0, 10)
      .map((v) => ({
        id: `sale_${v.id}`,
        type: "success" as const,
        title: "Nova venda",
        description: `Venda #${v.id} total R$ ${parseFloat(v.total.toString()).toLocaleString()}`,
        time: new Date(v.data_venda).toISOString(),
      }));
    return [...lowStock, ...sales].sort((a, b) => (a.time < b.time ? 1 : -1));
  },

  // Clientes
  async getClientes(page: number = 1, search?: string): Promise<PaginatedResponse<Cliente>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    if (search) params.append('search', search);
    
    return apiFetch<PaginatedResponse<Cliente>>(`/clientes/?${params}`);
  },

  async getCliente(id: number): Promise<Cliente> {
    return apiFetch<Cliente>(`/clientes/${id}/`);
  },

  async createCliente(cliente: Omit<Cliente, 'id'>): Promise<Cliente> {
    return apiFetch<Cliente>('/clientes/', {
      method: 'POST',
      body: JSON.stringify(cliente),
    });
  },

  async updateCliente(id: number, cliente: Partial<Cliente>): Promise<Cliente> {
    return apiFetch<Cliente>(`/clientes/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(cliente),
    });
  },

  async deleteCliente(id: number): Promise<void> {
    return apiFetch(`/clientes/${id}/`, { method: 'DELETE' });
  },

  // Funcionários
  async getFuncionarios(page: number = 1, search?: string): Promise<PaginatedResponse<Funcionario>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    if (search) params.append('search', search);
    const resp = await apiFetch<any>(`/accounts/funcionarios/?${params}`);
    if (Array.isArray(resp)) {
      return { count: resp.length, next: null, previous: null, results: resp as Funcionario[] };
    }
    return resp as PaginatedResponse<Funcionario>;
  },

  async getFuncionario(id: number): Promise<Funcionario> {
    return apiFetch<Funcionario>(`/accounts/funcionarios/${id}/`);
  },

  async createFuncionario(funcionario: any): Promise<Funcionario> {
    return apiFetch<Funcionario>('/accounts/register/', {
      method: 'POST',
      body: JSON.stringify(funcionario),
    });
  },

  async updateFuncionario(id: number, funcionario: any): Promise<Funcionario> {
    return apiFetch<Funcionario>(`/accounts/funcionarios/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(funcionario),
    });
  },

  async deleteFuncionario(id: number): Promise<void> {
    return apiFetch(`/accounts/funcionarios/${id}/`, { method: 'DELETE' });
  },

  async changePassword(id: number, oldPassword: string, newPassword: string): Promise<void> {
    return apiFetch(`/accounts/funcionarios/${id}/change_password/`, {
      method: 'POST',
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    });
  },

  // Fornecedores
  async getFornecedores(page: number = 1, search?: string): Promise<PaginatedResponse<Fornecedor>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    if (search) params.append('search', search);
    
    return apiFetch<PaginatedResponse<Fornecedor>>(`/fornecedores/?${params}`);
  },

  async getFornecedor(id: number): Promise<Fornecedor> {
    return apiFetch<Fornecedor>(`/fornecedores/${id}/`);
  },

  async createFornecedor(fornecedor: Omit<Fornecedor, 'id'>): Promise<Fornecedor> {
    return apiFetch<Fornecedor>('/fornecedores/', {
      method: 'POST',
      body: JSON.stringify(fornecedor),
    });
  },

  async updateFornecedor(id: number, fornecedor: Partial<Fornecedor>): Promise<Fornecedor> {
    return apiFetch<Fornecedor>(`/fornecedores/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(fornecedor),
    });
  },

  async deleteFornecedor(id: number): Promise<void> {
    return apiFetch(`/fornecedores/${id}/`, { method: 'DELETE' });
  },

  // Produtos
  async getProdutos(page: number = 1, search?: string): Promise<PaginatedResponse<Produto>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    if (search) params.append('search', search);
    
    return apiFetch<PaginatedResponse<Produto>>(`/produtos/?${params}`);
  },

  async getProduto(id: number): Promise<Produto> {
    return apiFetch<Produto>(`/produtos/${id}/`);
  },

  async createProduto(produto: Omit<Produto, 'id'>): Promise<Produto> {
    return apiFetch<Produto>('/produtos/', {
      method: 'POST',
      body: JSON.stringify(produto),
    });
  },

  async updateProduto(id: number, produto: Partial<Produto>): Promise<Produto> {
    return apiFetch<Produto>(`/produtos/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(produto),
    });
  },

  async deleteProduto(id: number): Promise<void> {
    return apiFetch(`/produtos/${id}/`, { method: 'DELETE' });
  },

  // Vendas
  async getVendas(page: number = 1, search?: string): Promise<PaginatedResponse<Venda>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    if (search) params.append('search', search);
    
    return apiFetch<PaginatedResponse<Venda>>(`/vendas/?${params}`);
  },

  async getVenda(id: number): Promise<Venda> {
    return apiFetch<Venda>(`/vendas/${id}/`);
  },

  async createVenda(venda: { cliente: number; funcionario: number; data_venda: string; total: string; status: string; observacao?: string; itens: { produto: number; quantidade: number; preco: string; subtotal: string }[] }): Promise<Venda> {
    return apiFetch<Venda>("/vendas/", {
      method: "POST",
      body: JSON.stringify(venda),
    });
  },

  async updateVenda(id: number, venda: Partial<Venda>): Promise<Venda> {
    return apiFetch<Venda>(`/vendas/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(venda),
    });
  },

  async deleteVenda(id: number): Promise<void> {
    return apiFetch(`/vendas/${id}/`, { method: "DELETE" });
  },

  // Estoque
  async getMovimentacoesEstoque(page: number = 1): Promise<PaginatedResponse<MovimentacaoEstoque>> {
    return apiFetch<PaginatedResponse<MovimentacaoEstoque>>(`/movimentacoes/?page=${page}`);
  },

  async createMovimentacaoEstoque(movimentacao: Omit<MovimentacaoEstoque, 'id' | 'data_movimento' | 'funcionario'>): Promise<MovimentacaoEstoque> {
    return apiFetch<MovimentacaoEstoque>('/movimentacoes/', {
      method: 'POST',
      body: JSON.stringify(movimentacao),
    });
  },

  // CEP
  async consultarCEP(cep: string): Promise<{
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
  }> {
    return apiFetch(`/clientes/cep/?cep=${cep.replace(/\D/g, '')}`);
  },
};

// Exportar APIs individuais
export const clientesApi = api;
export const funcionariosApi = api;
export const fornecedoresApi = api;
export const produtosApi = api;
export const vendasApi = api;

export default api;