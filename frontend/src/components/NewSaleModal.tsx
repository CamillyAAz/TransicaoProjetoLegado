import { useState } from "react";
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

interface OrderItem {
  produto_id: string;
  quantidade: number;
  preco: number;
  subtotal: number;
}

interface NewSaleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewSaleModal({ open, onOpenChange }: NewSaleModalProps) {
  const [items, setItems] = useState<OrderItem[]>([
    { produto_id: "", quantidade: 1, preco: 0, subtotal: 0 }
  ]);
  const [clienteId, setClienteId] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const addItem = () => {
    setItems([...items, { produto_id: "", quantidade: 1, preco: 0, subtotal: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Calculate subtotal
    if (field === "quantidade" || field === "preco") {
      newItems[index].subtotal = newItems[index].quantidade * newItems[index].preco;
    }
    
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Venda registrada com sucesso!");
    onOpenChange(false);
    // Reset form
    setItems([{ produto_id: "", quantidade: 1, preco: 0, subtotal: 0 }]);
    setClienteId("");
    setObservacoes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Nova Venda</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Venda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Cliente *</Label>
                <Select value={clienteId} onValueChange={setClienteId} required>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Ana Silva</SelectItem>
                    <SelectItem value="2">Carlos Santos</SelectItem>
                    <SelectItem value="3">Maria Oliveira</SelectItem>
                  </SelectContent>
                </Select>
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
                      value={item.produto_id}
                      onValueChange={(value) => updateItem(index, "produto_id", value)}
                      required
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Produto A</SelectItem>
                        <SelectItem value="2">Produto B</SelectItem>
                        <SelectItem value="3">Produto C</SelectItem>
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
            <Button type="submit" className="flex-1">Registrar Venda</Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
