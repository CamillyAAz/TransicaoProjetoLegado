import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, User, Shield, LogOut } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/lib/permissions";

const userSettings = [
  { icon: Lock, title: "Alterar Senha", description: "Altere sua senha para manter sua conta segura", path: "/settings/change-password" },
  { icon: User, title: "Perfil", description: "Atualize suas informações pessoais", path: "/settings/profile" },
];

const systemSettings = [
  { icon: Shield, title: "Permissões", description: "Gerencie as permissões de acesso", path: "/settings/permissions" },
];

export default function Settings() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const admin = isAdmin(user);
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1">Gerencie as configurações do sistema</p>
        </div>

        {/* User Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Usuário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {userSettings.map((setting, index) => (
              <button
                key={index}
                onClick={() => navigate(setting.path)}
                className="w-full flex items-center gap-4 p-4 rounded-md hover:bg-muted transition-colors text-left"
              >
                <div className="p-2 rounded-md bg-primary/10">
                  <setting.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{setting.title}</p>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* System Settings */}
        {admin && (
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {systemSettings.map((setting, index) => (
                <button
                  key={index}
                  onClick={() => navigate(setting.path)}
                  className="w-full flex items-center gap-4 p-4 rounded-md hover:bg-muted transition-colors text-left"
                >
                  <div className="p-2 rounded-md bg-chart-2/10">
                    <setting.icon className="h-5 w-5 text-chart-2" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{setting.title}</p>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Sessão */}
        <Card>
          <CardHeader>
            <CardTitle>Sessão</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Sair da conta
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
