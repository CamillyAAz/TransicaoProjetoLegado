import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Produto, Fornecedor } from "@/services/api";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/lib/permissions";

export default function Products() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const admin = isAdmin(user);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produto | null>(null);
  const [formData, setFormData] = useState({ 
    descricao: "", 
    preco: 0, 
    precoDisplay: "", 
    qtd_estoque: 0, 
    fornecedor: 0 
  });

  // Fetch products
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["produtos"],
    queryFn: () => api.getProdutos(),
  });
  
  // Fetch suppliers for dropdown (com fallback consolidado)
  const { data: suppliersList } = useQuery({
    queryKey: ["fornecedores"],
    queryFn: async () => {
      const paginated = await api.getFornecedores();
      if (paginated?.results?.length) return paginated.results;
      try {
        const alt = await apiFetch<{ total: number; fornecedores: Fornecedor[] }>(
          "/consultas/fornecedores"
        );
        return alt.fornecedores || [];
      } catch {
        return [] as Fornecedor[];
      }
    },
  });

  const products = useMemo(() => productsData?.results || [], [productsData]);
  const suppliers = useMemo(() => (Array.isArray(suppliersList) ? suppliersList : []), [suppliersList]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: api.createProduto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      toast.success("Produto criado com sucesso");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erro ao criar produto");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Produto> }) => api.updateProduto(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      toast.success("Produto atualizado com sucesso");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erro ao atualizar produto");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteProduto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      toast.success("Produto excluído com sucesso");
    },
    onError: () => {
      toast.error("Erro ao excluir produto");
    },
  });

  const handleSave = () => {
    if (!admin) {
      toast.error("Ação permitida apenas para administradores");
      return;
    }
    if (!formData.descricao || formData.preco <= 0 || formData.qtd_estoque < 0 || !formData.fornecedor) {
      toast.error("Preencha todos os campos corretamente");
      return;
    }

    const productData = {
      descricao: formData.descricao,
      preco: formData.preco.toString(),
      qtd_estoque: formData.qtd_estoque,
      fornecedor: formData.fornecedor,
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: productData });
    } else {
      createMutation.mutate(productData);
    }
  };

  const handleEdit = (product: Produto) => {
    if (!admin) {
      toast.error("Ação permitida apenas para administradores");
      return;
    }
    setEditingProduct(product);
    setFormData({
      descricao: product.descricao,
      preco: Number(product.preco),
      precoDisplay: Number(product.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      qtd_estoque: product.qtd_estoque,
      fornecedor: product.fornecedor,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (!admin) {
      toast.error("Ação permitida apenas para administradores");
      return;
    }
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setFormData({ descricao: "", preco: 0, precoDisplay: "", qtd_estoque: 0, fornecedor: 0 });
    setEditingProduct(null);
  };

  const handlePrecoChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const number = digits ? parseInt(digits, 10) / 100 : 0;
    setFormData((prev) => ({
      ...prev,
      preco: number,
      precoDisplay: number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    }));
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Produtos</h1>
            <p className="text-muted-foreground mt-1">Gerencie seu inventário</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            {admin && (
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Produto
                </Button>
              </DialogTrigger>
            )}
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Descrição *</Label>
                  <Input
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preço (R$) *</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formData.precoDisplay}
                    onChange={(e) => handlePrecoChange(e.target.value)}
                    className="bg-background"
                    placeholder="R$ 0,00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quantidade em Estoque *</Label>
                  <Input
                    type="number"
                    value={formData.qtd_estoque}
                    onChange={(e) => setFormData({ ...formData, qtd_estoque: parseInt(e.target.value) })}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fornecedor *</Label>
                  <select
                    value={formData.fornecedor}
                    onChange={(e) => setFormData({ ...formData, fornecedor: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded-md bg-background"
                  >
                    <option value={0}>Selecione um fornecedor</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSave} 
                    className="flex-1"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? "Salvando..." : "Salvar"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue={admin ? "table" : "cards"} className="w-full">
          <TabsList>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            {admin && <TabsTrigger value="table">Tabela</TabsTrigger>}
          </TabsList>

          <TabsContent value="cards">
            {productsLoading ? (
              <div className="text-center py-8">Carregando produtos...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{product.descricao}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-2xl font-bold text-primary">
                          R$ {Number(product.preco).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Estoque: {product.qtd_estoque} unidades
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Fornecedor: {product.fornecedor_nome || `#${product.fornecedor}`}
                        </p>
                        <div className="flex gap-2 pt-2">
                          {admin && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                                <Edit className="h-3 w-3 mr-1" />
                                Editar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(product.id)}
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="h-3 w-3 mr-1 text-destructive" />
                                Remover
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {admin && (
          <TabsContent value="table">
            <div className="rounded-md border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productsLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Carregando produtos...
                      </TableCell>
                    </TableRow>
                  ) : products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Nenhum produto encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.descricao}</TableCell>
                        <TableCell>R$ {Number(product.preco).toFixed(2)}</TableCell>
                        <TableCell>{product.qtd_estoque}</TableCell>
                        <TableCell>{product.fornecedor_nome || `#${product.fornecedor}`}</TableCell>
                        <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {admin && (
                            <>
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(product.id)}
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </>
                          )}
                        </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
