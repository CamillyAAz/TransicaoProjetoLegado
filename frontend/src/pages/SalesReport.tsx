import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { vendasApi, produtosApi, Venda, Produto } from "@/services/api";
import { useState } from "react";
import { format, parseISO } from "date-fns";

export default function SalesReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: vendasData } = useQuery({
    queryKey: ["vendas"],
    queryFn: () => vendasApi.getVendas(1),
  });

  const { data: produtosData } = useQuery({
    queryKey: ["produtos"],
    queryFn: () => produtosApi.getProdutos(1),
  });

  const vendas = vendasData?.results || [];
  const produtos = produtosData?.results || [];

  // Filtrar vendas por data
  const filteredVendas = vendas.filter((venda: Venda) => {
    if (!startDate && !endDate) return true;
    const vendaDate = parseISO(venda.data_venda);
    const start = startDate ? parseISO(startDate) : null;
    const end = endDate ? parseISO(endDate) : null;
    
    if (start && vendaDate < start) return false;
    if (end && vendaDate > end) return false;
    return true;
  });

  // Calcular vendas por semana
  const weeklyData = (() => {
    const salesByWeek: { [key: string]: number } = {};
    
    filteredVendas.forEach((venda: Venda) => {
      const date = parseISO(venda.data_venda);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = `Sem ${Math.ceil((date.getDate()) / 7)}`;
      
      salesByWeek[weekKey] = (salesByWeek[weekKey] || 0) + parseFloat(venda.total);
    });

    return Object.entries(salesByWeek).map(([week, value]) => ({ week, value }));
  })();

  // Calcular vendas por produto
  const productSales = (() => {
    const productSalesMap: { [key: string]: { quantity: number; revenue: number } } = {};
    
    filteredVendas.forEach((venda: Venda) => {
      venda.itens?.forEach((item: any) => {
        const produto = produtos.find((p: Produto) => p.id === item.produto);
        const productName = produto?.descricao || produto?.nome || `Produto ${item.produto}`;
        
        if (!productSalesMap[productName]) {
          productSalesMap[productName] = { quantity: 0, revenue: 0 };
        }
        
        productSalesMap[productName].quantity += item.quantidade;
        productSalesMap[productName].revenue += parseFloat(item.subtotal);
      });
    });

    return Object.entries(productSalesMap).map(([product, data]) => ({
      product,
      quantity: data.quantity,
      revenue: `R$ ${data.revenue.toLocaleString()}`
    }));
  })();

  const totalSales = filteredVendas.reduce((sum: number, venda: Venda) => {
    return sum + parseFloat(venda.total);
  }, 0);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatório de Vendas</h1>
          <p className="text-muted-foreground mt-1">Análise detalhada de vendas</p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data de Início</Label>
              <Input 
                type="date" 
                className="bg-background" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Data de Fim</Label>
              <Input 
                type="date" 
                className="bg-background" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Total Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas Totais</CardTitle>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">R$ {totalSales.toLocaleString()}</span>
              <span className="text-sm text-success flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Período Selecionado
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <XAxis
                  dataKey="week"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `R$ ${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`R$ ${value.toLocaleString()}`, "Vendas"]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Product Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Quantidade Vendida</TableHead>
                  <TableHead className="text-right">Receita Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productSales.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.product}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right font-medium">{item.revenue}</TableCell>
                  </TableRow>
                ))}
                {productSales.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Nenhuma venda encontrada no período selecionado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
