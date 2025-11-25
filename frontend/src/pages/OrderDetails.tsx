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

const orderItems = [
  { product: "Produto A", quantity: 2, unitPrice: "R$ 50,00", total: "R$ 100,00" },
  { product: "Produto B", quantity: 1, unitPrice: "R$ 75,00", total: "R$ 75,00" },
  { product: "Produto C", quantity: 3, unitPrice: "R$ 25,00", total: "R$ 75,00" },
];

export default function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

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
            <p className="text-muted-foreground mt-1">Criado em 15 de março de 2024</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Cliente</p>
              <p className="text-foreground font-medium">Responsável</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Beatriz Sousa</p>
              <p className="text-foreground font-medium">Carlos Lima</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status do Pagamento</p>
              <p className="text-foreground font-medium">Pago</p>
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
                {orderItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.product}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.unitPrice}</TableCell>
                    <TableCell className="text-right font-medium">{item.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6 space-y-2 border-t border-border pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">R$ 250,00</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>R$ 250,00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
