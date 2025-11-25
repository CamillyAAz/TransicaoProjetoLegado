import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueries } from "@tanstack/react-query";
import { clientesApi, vendasApi, Venda, Cliente, ItemVenda } from "@/services/api";


export default function ClientDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: cliente } = useQuery({
    queryKey: ["cliente", id],
    queryFn: () => clientesApi.getCliente(Number(id)),
    enabled: !!id,
  });

  const { data: vendasData } = useQuery({
    queryKey: ["vendas-cliente", id],
    queryFn: () => vendasApi.getVendas(1),
  });

  const vendas = vendasData?.results || [];

  // Filtrar vendas do cliente
  const clienteVendas = vendas.filter((venda: Venda) => venda.cliente === Number(id));

  // Buscar detalhes de cada venda para montar histórico de compras
  const vendaDetalhes = useQueries({
    queries: clienteVendas.map((venda: Venda) => ({
      queryKey: ["venda", venda.id],
      queryFn: () => vendasApi.getVenda(venda.id),
      enabled: !!id && clienteVendas.length > 0,
    })),
  });

  const isLoadingHistorico = vendaDetalhes.some((q) => q.isLoading);
  const historicoItens = vendaDetalhes.flatMap((q) =>
    (q.data?.itens || []).map((item: ItemVenda) => ({
      date: q.data?.data_venda,
      product: item.produto_descricao || `Produto ${item.produto}`,
      quantity: item.quantidade,
      total: Number(item.subtotal),
    }))
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/clients")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Detalhes do Cliente</h1>
            <p className="text-muted-foreground mt-1">Visualize e gerencie as informações do cliente</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nome</p>
                  <p className="text-foreground font-medium">{cliente?.nome || "Carregando..."}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="text-foreground font-medium">{cliente?.email || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Telefone</p>
                  <p className="text-foreground font-medium">{cliente?.telefone || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Endereço</p>
                  <p className="text-foreground font-medium">{cliente?.endereco || "-"}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pedidos Vinculados</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID do Pedido</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clienteVendas.map((venda: Venda) => (
                      <TableRow key={venda.id}>
                        <TableCell className="font-medium">#{venda.id}</TableCell>
                        <TableCell>{new Date(venda.data_venda).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={venda.status === "Concluído" ? "default" : "secondary"}>
                            {venda.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">R$ {parseFloat(venda.total).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    {clienteVendas.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          Nenhuma venda encontrada para este cliente
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Compras</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingHistorico && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          Carregando histórico...
                        </TableCell>
                      </TableRow>
                    )}
                    {!isLoadingHistorico && historicoItens.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          Nenhum item encontrado para este cliente
                        </TableCell>
                      </TableRow>
                    )}
                    {!isLoadingHistorico && historicoItens.map((purchase, index) => (
                      <TableRow key={`${purchase.product}-${index}`}>
                        <TableCell>{purchase.date ? new Date(purchase.date).toLocaleDateString() : "-"}</TableCell>
                        <TableCell className="font-medium">{purchase.product}</TableCell>
                        <TableCell>{purchase.quantity}</TableCell>
                        <TableCell className="text-right font-medium">
                          {purchase.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
