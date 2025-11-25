import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const integrations = [
  {
    name: "Mercado Pago",
    description: "Processar pagamentos online",
    status: "connected",
    icon: "💳",
  },
  {
    name: "Correios",
    description: "Calcular frete e rastrear encomendas",
    status: "disconnected",
    icon: "📦",
  },
  {
    name: "Google Analytics",
    description: "Análise de dados e métricas",
    status: "connected",
    icon: "📊",
  },
  {
    name: "Mailchimp",
    description: "Email marketing e automação",
    status: "disconnected",
    icon: "✉️",
  },
];

export default function Integrations() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Integrações</h1>
            <p className="text-muted-foreground mt-1">Configure integrações com outros sistemas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <Card key={integration.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{integration.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant={integration.status === "connected" ? "default" : "secondary"}>
                    {integration.status === "connected" ? "Conectado" : "Desconectado"}
                  </Badge>
                  <Switch defaultChecked={integration.status === "connected"} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
