import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NewSaleModal } from "@/components/NewSaleModal";

const todayOrders = [
  { id: 1, cliente_id: 1, clienteNome: "Ana Silva", funcionarioNome: "Carlos Lima", data_venda: "2024-11-10", total_venda: 250.00, status: "Concluído", observacoes: "" },
  { id: 2, cliente_id: 2, clienteNome: "João Santos", funcionarioNome: "Paula Costa", data_venda: "2024-11-10", total_venda: 180.00, status: "Pendente", observacoes: "" },
  { id: 3, cliente_id: 3, clienteNome: "Maria Oliveira", funcionarioNome: "Carlos Lima", data_venda: "2024-11-10", total_venda: 320.00, status: "Concluído", observacoes: "" },
];

export default function Sales() {
  const navigate = useNavigate();
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Vendas</h1>
            <p className="text-muted-foreground mt-1">Pedidos do dia</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setIsNewSaleOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Venda
            </Button>
            <Button variant="outline" onClick={() => navigate("/sales/report")}>
              Ver Relatório de Vendas
            </Button>
          </div>
        </div>

        <div className="rounded-md border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID do Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todayOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{order.clienteNome}</TableCell>
                  <TableCell>{order.funcionarioNome}</TableCell>
                  <TableCell>{new Date(order.data_venda).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === "Concluído" ? "default" : "secondary"}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    R$ {order.total_venda.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/sales/${order.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <NewSaleModal open={isNewSaleOpen} onOpenChange={setIsNewSaleOpen} />
    </DashboardLayout>
  );
}
