import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const roles = [
  {
    name: "Administrador",
    description: "Acesso completo ao sistema",
    users: 2,
    color: "default",
  },
  {
    name: "Gerente",
    description: "Gerenciar vendas e relatórios",
    users: 5,
    color: "secondary",
  },
  {
    name: "Vendedor",
    description: "Registrar vendas e atender clientes",
    users: 12,
    color: "secondary",
  },
  {
    name: "Estoquista",
    description: "Gerenciar produtos e estoque",
    users: 3,
    color: "secondary",
  },
];

export default function UserRoles() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Papéis de Usuário</h1>
              <p className="text-muted-foreground mt-1">Defina os papéis dos usuários</p>
            </div>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Papel
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role) => (
            <Card key={role.name} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{role.name}</CardTitle>
                  <Badge variant={role.color as any}>{role.users} usuários</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{role.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
