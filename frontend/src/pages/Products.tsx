import { useState } from "react";
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

interface Product {
  id: string;
  descricao: string;
  preco: number;
  qtd_estoque: number;
  for_id: string;
}

const initialProducts: Product[] = [
  { id: "1", descricao: "Notebook Dell Inspiron 15", preco: 3500, qtd_estoque: 50, for_id: "1" },
  { id: "2", descricao: "Mouse Logitech MX Master", preco: 450, qtd_estoque: 30, for_id: "2" },
  { id: "3", descricao: "Teclado Mecânico Keychron", preco: 680, qtd_estoque: 20, for_id: "1" },
  { id: "4", descricao: "Monitor LG UltraWide 29\"", preco: 1200, qtd_estoque: 10, for_id: "2" },
  { id: "5", descricao: "Webcam Logitech C920", preco: 520, qtd_estoque: 40, for_id: "2" },
  { id: "6", descricao: "Headset HyperX Cloud II", preco: 590, qtd_estoque: 60, for_id: "1" },
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ descricao: "", preco: 0, qtd_estoque: 0, for_id: "" });

  const handleSave = () => {
    if (!formData.descricao || formData.preco <= 0 || formData.qtd_estoque < 0) {
      toast.error("Preencha todos os campos corretamente");
      return;
    }

    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? { ...p, ...formData } : p)));
      toast.success("Produto atualizado");
    } else {
      setProducts([...products, { id: Date.now().toString(), ...formData }]);
      toast.success("Produto adicionado");
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    toast.success("Produto removido");
  };

  const resetForm = () => {
    setFormData({ descricao: "", preco: 0, qtd_estoque: 0, for_id: "" });
    setEditingProduct(null);
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
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Input
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preço (R$)</Label>
                  <Input
                    type="number"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: Number(e.target.value) })}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quantidade em Estoque</Label>
                  <Input
                    type="number"
                    value={formData.qtd_estoque}
                    onChange={(e) => setFormData({ ...formData, qtd_estoque: Number(e.target.value) })}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label>ID Fornecedor</Label>
                  <Input
                    value={formData.for_id}
                    onChange={(e) => setFormData({ ...formData, for_id: e.target.value })}
                    className="bg-background"
                    placeholder="ID do fornecedor"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex-1">Salvar</Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="table" className="w-full">
          <TabsList>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="table">Tabela</TabsTrigger>
          </TabsList>

          <TabsContent value="cards">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{product.descricao}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-primary">R$ {product.preco.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Estoque: {product.qtd_estoque} unidades</p>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1 text-destructive" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

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
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.descricao}</TableCell>
                      <TableCell>R$ {product.preco.toFixed(2)}</TableCell>
                      <TableCell>{product.qtd_estoque}</TableCell>
                      <TableCell>#{product.for_id}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
