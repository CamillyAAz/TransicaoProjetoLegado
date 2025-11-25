import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, User, Globe, Palette, Shield, Users, Link } from "lucide-react";
import { ChevronRight } from "lucide-react";

const userSettings = [
  { icon: Lock, title: "Alterar Senha", description: "Altere sua senha para manter sua conta segura" },
  { icon: User, title: "Perfil", description: "Atualize suas informações pessoais" },
  { icon: Globe, title: "Idioma", description: "Escolha o idioma de sua preferência" },
  { icon: Palette, title: "Tema", description: "Selecione o tema claro ou escuro" },
];

const systemSettings = [
  { icon: Shield, title: "Permissões", description: "Gerencie as permissões de acesso" },
  { icon: Users, title: "Papéis de Usuário", description: "Defina os papéis dos usuários" },
  { icon: Link, title: "Integrações", description: "Configure integrações com outros sistemas" },
];

export default function Settings() {
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
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {systemSettings.map((setting, index) => (
              <button
                key={index}
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
      </div>
    </DashboardLayout>
  );
}
