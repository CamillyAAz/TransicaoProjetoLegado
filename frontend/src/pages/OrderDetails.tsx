import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { vendasApi, clientesApi, produtosApi, Venda, Cliente, Produto } from "@/services/api";

const orderItems = [
  { product: "Produto A", quantity: 2, unitPrice: "R$ 50,00", total: "R$ 100,00" },
  { product: "Produto B", quantity: 1, unitPrice: "R$ 75,00", total: "R$ 75,00" },
  { product: "Produto C", quantity: 3, unitPrice: "R$ 25,00", total: "R$ 75,00" },
];

export default function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: venda } = useQuery({
    queryKey: ["venda", id],
    queryFn: () => vendasApi.getVenda(Number(id)),
    enabled: !!id,
  });

  const { data: clientesData } = useQuery({
    queryKey: ["clientes"],
    queryFn: () => clientesApi.getClientes(1),
  });

  const clientes = clientesData?.results || [];

  const { data: produtosData } = useQuery({
    queryKey: ["produtos"],
    queryFn: () => produtosApi.getProdutos(1),
  });

  const produtos = produtosData?.results || [];

  const cliente = clientes.find((c: Cliente) => c.id === venda?.cliente);
  
  const total = venda?.itens?.reduce((sum: number, item: any) => {
    return sum + parseFloat(item.subtotal);
  }, 0) || 0;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/sales")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="text-sm text-muted-foreground">Vendas / Pedido #{id}</div>
            <h1 className="text-3xl font-bold text-foreground">Pedido #{id}</h1>
            <p className="text-muted-foreground mt-1">
              {venda ? `Criado em ${new Date(venda.data_venda).toLocaleDateString()}` : "Carregando..."}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Cliente</p>
              <p className="text-foreground font-medium">{cliente?.nome || "Carregando..."}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <p className="text-foreground font-medium">{venda?.status || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Observações</p>
              <p className="text-foreground font-medium">{venda?.observacao || "-"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Itens do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Preço Unitário</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {venda?.itens?.map((item: any, index: number) => {
                  const produto = produtos.find((p: Produto) => p.id === item.produto);
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{produto?.descricao || produto?.nome || `Produto ${item.produto}`}</TableCell>
                      <TableCell>{item.quantidade}</TableCell>
                      <TableCell>R$ {parseFloat(item.preco_unitario).toLocaleString()}</TableCell>
                      <TableCell className="text-right font-medium">R$ {parseFloat(item.subtotal).toLocaleString()}</TableCell>
                    </TableRow>
                  );
                })}
                {!venda?.itens?.length && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Nenhum item encontrado nesta venda
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="mt-6 space-y-2 border-t border-border pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>R$ {total.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
