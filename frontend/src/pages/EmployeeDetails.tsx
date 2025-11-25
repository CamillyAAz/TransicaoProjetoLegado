import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { normalizeNivel } from "@/lib/permissions";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { funcionariosApi, Funcionario } from "@/services/api";

export default function EmployeeDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: employee } = useQuery({
    queryKey: ["funcionario", id],
    queryFn: () => funcionariosApi.getFuncionario(Number(id)),
    enabled: !!id,
  });

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/employees")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Detalhes do Funcionário</h1>
            <p className="text-muted-foreground mt-1">Visualize e gerencie as informações do funcionário</p>
          </div>
          <Badge variant={normalizeNivel(employee?.nivel_acesso) === "admin" ? "default" : "secondary"}>
            {employee?.nivel_acesso || "Carregando..."}
          </Badge>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="access">Acessos</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Nome Completo</p>
                    <p className="text-foreground font-medium">{employee?.nome || "Carregando..."}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">CPF</p>
                    <p className="text-foreground font-medium">{employee?.cpf || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">RG</p>
                    <p className="text-foreground font-medium">{employee?.rg || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Cargo</p>
                    <p className="text-foreground font-medium">{employee?.cargo || "-"}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-foreground font-medium">{employee?.email || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p className="text-foreground font-medium">{employee?.telefone || "-"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Endereço</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-foreground font-medium">
                        {employee?.endereco || "-"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {employee?.cidade || "-"} - {employee?.estado || "-"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="access" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Permissões de Acesso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <span className="text-foreground">Nível de Acesso</span>
                    <Badge variant={normalizeNivel(employee?.nivel_acesso) === "admin" ? "default" : "secondary"}>
                      {employee?.nivel_acesso || "-"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <span className="text-foreground">Dashboard</span>
                    <Badge variant="default">Permitido</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <span className="text-foreground">Vendas</span>
                    <Badge variant="default">Permitido</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <span className="text-foreground">Clientes</span>
                    <Badge variant="default">Permitido</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Atividades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 pb-4 border-b border-border">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="text-foreground font-medium">Login no sistema</p>
                      <p className="text-sm text-muted-foreground">Hoje às 09:30</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 pb-4 border-b border-border">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="text-foreground font-medium">Venda registrada #12345</p>
                      <p className="text-sm text-muted-foreground">Hoje às 14:20</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 pb-4 border-b border-border">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground mt-2" />
                    <div>
                      <p className="text-foreground font-medium">Cliente cadastrado</p>
                      <p className="text-sm text-muted-foreground">Ontem às 16:45</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
