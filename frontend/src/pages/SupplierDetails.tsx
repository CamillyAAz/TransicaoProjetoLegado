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
import { useQuery } from "@tanstack/react-query";
import { fornecedoresApi, produtosApi, Fornecedor, Produto } from "@/services/api";

const contracts = [
  { id: "CT001", name: "Contrato de Fornecimento de Hardware", startDate: "01/01/2023", endDate: "31/12/2023", status: "Ativo" },
  { id: "CT002", name: "Contrato de Manutenção de Software", startDate: "15/02/2023", endDate: "14/02/2024", status: "Ativo" },
  { id: "CT003", name: "Contrato de Consultoria em TI", startDate: "01/03/2023", endDate: "31/03/2023", status: "Concluído" },
];

const supplyHistory = [
  { date: "15/01/2024", product: "Servidores Dell PowerEdge", quantity: 5, total: "R$ 45.000,00" },
  { date: "22/12/2023", product: "Licenças Microsoft Office", quantity: 50, total: "R$ 12.500,00" },
];

export default function SupplierDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: fornecedor } = useQuery({
    queryKey: ["fornecedor", id],
    queryFn: () => fornecedoresApi.getFornecedor(Number(id)),
    enabled: !!id,
  });

  const { data: produtos = [] } = useQuery({
    queryKey: ["produtos-fornecedor", id],
    queryFn: produtosApi.getProdutos,
  });

  // Filtrar produtos do fornecedor
  const fornecedorProdutos = produtos.filter((produto: Produto) => produto.fornecedor === Number(id));

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/suppliers")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fornecedor: {fornecedor?.nome || "Carregando..."}</h1>
            <p className="text-muted-foreground mt-1">Detalhes do fornecedor</p>
          </div>
        </div>

        <Tabs defaultValue="contracts" className="w-full">
          <TabsList>
            <TabsTrigger value="contracts">Contratos</TabsTrigger>
            <TabsTrigger value="history">Histórico de Fornecimento</TabsTrigger>
          </TabsList>

          <TabsContent value="contracts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Fornecedor</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nome</p>
                  <p className="text-foreground font-medium">{fornecedor?.nome || "Carregando..."}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">CNPJ</p>
                  <p className="text-foreground font-medium">{fornecedor?.cnpj || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Telefone</p>
                  <p className="text-foreground font-medium">{fornecedor?.telefone || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="text-foreground font-medium">{fornecedor?.email || "-"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Endereço</p>
                  <p className="text-foreground font-medium">{fornecedor?.endereco || "-"}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Produtos do Fornecedor</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Estoque</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fornecedorProdutos.map((produto: Produto) => (
                      <TableRow key={produto.id}>
                        <TableCell className="font-medium">{produto.nome}</TableCell>
                        <TableCell>{produto.descricao}</TableCell>
                        <TableCell>R$ {parseFloat(produto.preco).toLocaleString()}</TableCell>
                        <TableCell>{produto.qtd_estoque}</TableCell>
                      </TableRow>
                    ))}
                    {fornecedorProdutos.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          Nenhum produto encontrado para este fornecedor
                        </TableCell>
                      </TableRow>
                    )}
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
