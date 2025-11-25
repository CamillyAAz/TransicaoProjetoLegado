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
import { useNavigate } from "react-router-dom";

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

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/suppliers")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fornecedor: Tech Solutions Ltda.</h1>
            <p className="text-muted-foreground mt-1">Detalhes do fornecedor</p>
          </div>
        </div>

        <Tabs defaultValue="contracts" className="w-full">
          <TabsList>
            <TabsTrigger value="contracts">Contratos</TabsTrigger>
            <TabsTrigger value="history">Histórico de Fornecimento</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
          </TabsList>

          <TabsContent value="contracts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contratos</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome do Contrato</TableHead>
                      <TableHead>Data de Início</TableHead>
                      <TableHead>Data de Término</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell className="font-medium">{contract.id}</TableCell>
                        <TableCell>{contract.name}</TableCell>
                        <TableCell>{contract.startDate}</TableCell>
                        <TableCell>{contract.endDate}</TableCell>
                        <TableCell>
                          <Badge variant={contract.status === "Ativo" ? "default" : "secondary"}>
                            {contract.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Fornecimento</CardTitle>
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
                    {supplyHistory.map((supply, index) => (
                      <TableRow key={index}>
                        <TableCell>{supply.date}</TableCell>
                        <TableCell className="font-medium">{supply.product}</TableCell>
                        <TableCell>{supply.quantity}</TableCell>
                        <TableCell className="text-right font-medium">{supply.total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Documentos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Nenhum documento disponível no momento.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
