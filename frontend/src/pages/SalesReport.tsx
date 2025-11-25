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

const weeklyData = [
  { week: "Sem 1", value: 28000 },
  { week: "Sem 2", value: 32000 },
  { week: "Sem 3", value: 29500 },
  { week: "Sem 4", value: 31000 },
];

const productSales = [
  { product: "Produto A", quantity: 150, revenue: "R$ 30.000" },
  { product: "Produto B", quantity: 200, revenue: "R$ 40.000" },
  { product: "Produto C", quantity: 100, revenue: "R$ 20.000" },
  { product: "Produto D", quantity: 75, revenue: "R$ 15.000" },
  { product: "Produto E", quantity: 50, revenue: "R$ 10.500" },
];

export default function SalesReport() {
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
              <Input type="date" className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label>Data de Fim</Label>
              <Input type="date" className="bg-background" />
            </div>
          </CardContent>
        </Card>

        {/* Total Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas Totais</CardTitle>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">R$ 120.500</span>
              <span className="text-sm text-success flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Este Mês +15%
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
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
