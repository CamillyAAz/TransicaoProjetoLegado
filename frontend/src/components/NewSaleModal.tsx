import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { api, Venda, Funcionario } from "@/services/api";

interface OrderItem {
  produto: number;
  quantidade: number;
  preco: number;
  subtotal: number;
}

interface Cliente {
  id: number;
  nome: string;
}

interface Produto {
  id: number;
  nome: string;
  preco: string;
}

interface NewSaleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Comentário: callback para criação de venda (permissão aplicada em Sales.tsx)
  onSaleCreated?: (vendaData: {
    cliente: number;
    funcionario: number;
    data_venda: string;
    total: string;
    status: string;
    observacao?: string;
    itens: { produto: number; quantidade: number; preco: string; subtotal: string }[];
  }) => void;
  // Comentário: callback para atualização de venda (edição habilitada para usuário não-admin)
  onSaleUpdated?: (id: number, vendaData: Partial<Venda>) => void;
  // Comentário: modo de operação do modal (create | edit)
  mode?: "create" | "edit";
  // Comentário: venda inicial para edição
  initialSale?: Venda | null;
}

export function NewSaleModal({ open, onOpenChange, onSaleCreated, onSaleUpdated, mode = "create", initialSale = null }: NewSaleModalProps) {
  const [items, setItems] = useState<OrderItem[]>([
    { produto: 0, quantidade: 1, preco: 0, subtotal: 0 }
  ]);
  const [cliente, setCliente] = useState<number>(0);
  const [funcionario, setFuncionario] = useState<number>(0);
  const [observacoes, setObservacoes] = useState("");

  // Fetch clients and products data
  const { data: clientesData } = useQuery({
    queryKey: ["clientes"],
    queryFn: () => api.getClientes(1),
  });
  const clientes = clientesData?.results || [];

  const { data: produtosData } = useQuery({
    queryKey: ["produtos"],
    queryFn: () => api.getProdutos(1),
  });
  const produtos = produtosData?.results || [];

  const { data: funcionariosData } = useQuery({
    queryKey: ["funcionarios"],
    queryFn: () => api.getFuncionarios(1),
  });
  const funcionarios = funcionariosData?.results || [];

  // Comentário: quando em modo edição, preencher o formulário com a venda existente
  useEffect(() => {
    if (open && mode === "edit" && initialSale) {
      setCliente(initialSale.cliente || 0);
      setFuncionario(initialSale.funcionario);
      setObservacoes(initialSale.observacao || "");
      const initialItems: OrderItem[] = (initialSale.itens || []).map((it) => ({
        produto: it.produto,
        quantidade: it.quantidade,
        preco: it.preco_unitario,
        subtotal: it.subtotal,
      }));
      setItems(initialItems.length ? initialItems : [{ produto: 0, quantidade: 1, preco: 0, subtotal: 0 }]);
    }
  }, [open, mode, initialSale]);

  const addItem = () => {
    setItems([...items, { produto: 0, quantidade: 1, preco: 0, subtotal: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Calculate subtotal
    if (field === "quantidade" || field === "preco") {
      newItems[index].subtotal = newItems[index].quantidade * newItems[index].preco;
    }
    
    setItems(newItems);
  };

  const handleProductChange = (index: number, produtoId: number) => {
    const newItems = [...items];
    newItems[index].produto = produtoId;
    
    // Auto-fill price when product is selected
    const selectedProduct = produtos.find((p: Produto) => p.id === produtoId);
    if (selectedProduct) {
      newItems[index].preco = parseFloat(selectedProduct.preco);
      newItems[index].subtotal = newItems[index].quantidade * newItems[index].preco;
    }
    
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cliente || !funcionario) {
      toast.error("Por favor, selecione o cliente e o funcionário");
      return;
    }

    if (items.length === 0 || items.some(item => !item.produto || item.quantidade <= 0)) {
      toast.error("Por favor, adicione pelo menos um item válido");
      return;
    }

    const vendaData = {
      cliente,
      funcionario,
      data_venda: new Date().toISOString().split('T')[0],
      total: calculateTotal().toString(),
      status: "Pendente",
      observacao: observacoes,
      itens: items.map(item => ({
        produto: item.produto,
        quantidade: item.quantidade,
        preco: item.preco.toString(),
        subtotal: item.subtotal.toString()
      }))
    };
    // Comentário: seleção de ação conforme modo (create/edit) com verificação de callbacks
    if (mode === "edit" && initialSale && onSaleUpdated) {
      onSaleUpdated(initialSale.id, {
        cliente: vendaData.cliente,
        funcionario: vendaData.funcionario,
        status: vendaData.status,
        observacao: vendaData.observacao,
        // Nota: atualização de itens pode exigir endpoint específico; aqui sinalizamos total/status
        total: parseFloat(vendaData.total),
      });
    } else if (onSaleCreated) {
      onSaleCreated(vendaData);
    }
    
    // Reset form
    setItems([{ produto: 0, quantidade: 1, preco: 0, subtotal: 0 }]);
    setCliente(0);
    setFuncionario(0);
    setObservacoes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{mode === "edit" ? "Editar Venda" : "Nova Venda"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Venda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cliente *</Label>
                  <Select 
                    value={cliente.toString()} 
                    onValueChange={(value) => setCliente(parseInt(value))} 
                    required
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((cliente: Cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id.toString()}>
                          {cliente.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Funcionário *</Label>
                  <Select 
                    value={funcionario.toString()} 
                    onValueChange={(value) => setFuncionario(parseInt(value))} 
                    required
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Selecione o funcionário" />
                    </SelectTrigger>
                    <SelectContent>
                      {funcionarios.map((func: Funcionario) => (
                        <SelectItem key={func.id} value={func.id.toString()}>
                          {func.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="bg-background"
                  placeholder="Observações sobre a venda..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Itens do Pedido</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-5 space-y-2">
                    <Label>Produto</Label>
                    <Select
                      value={item.produto.toString()}
                      onValueChange={(value) => handleProductChange(index, parseInt(value))}
                      required
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {produtos.map((produto: Produto) => (
                          <SelectItem key={produto.id} value={produto.id.toString()}>
                            {produto.descricao || produto.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Qtd</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantidade}
                      onChange={(e) => updateItem(index, "quantidade", Number(e.target.value))}
                      className="bg-background"
                      required
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Preço</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.preco}
                      onChange={(e) => updateItem(index, "preco", Number(e.target.value))}
                      className="bg-background"
                      required
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Subtotal</Label>
                    <Input
                      type="text"
                      value={`R$ ${item.subtotal.toFixed(2)}`}
                      className="bg-background"
                      readOnly
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>R$ {calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">{mode === "edit" ? "Salvar Alterações" : "Registrar Venda"}</Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
