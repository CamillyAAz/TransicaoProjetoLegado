import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { normalizeNivel } from "@/lib/permissions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Funcionario } from "@/services/api";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";

type UiPerms = {
  dashboard: boolean;
  vendas: boolean;
  clientes: boolean;
  produtos: boolean;
  fornecedores: boolean;
  relatorios: boolean;
};

function parsePerms(s?: string | null): UiPerms {
  try {
    const obj = s ? JSON.parse(s) : {};
    return {
      dashboard: obj.dashboard ?? true,
      vendas: obj.vendas ?? true,
      clientes: obj.clientes ?? true,
      produtos: obj.produtos ?? true,
      fornecedores: obj.fornecedores ?? true,
      relatorios: obj.relatorios ?? true,
    };
  } catch {
    return { dashboard: true, vendas: true, clientes: true, produtos: true, fornecedores: true, relatorios: true };
  }
}

export default function Permissions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = normalizeNivel(user?.nivel_acesso) === "admin";
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAdmin) navigate("/settings", { replace: true });
  }, [isAdmin, navigate]);

  const { data: funcionarios } = useQuery({
    queryKey: ["funcionarios"],
    queryFn: () => api.getFuncionarios(1),
  });

  const updatePerms = useMutation({
    mutationFn: async ({ id, perms }: { id: number; perms: UiPerms }) => {
      const ui_permissoes = JSON.stringify(perms);
      await api.updateFuncionario(id, { ui_permissoes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funcionarios"], exact: false });
      toast.success("Permissões atualizadas com sucesso");
    },
    onError: () => toast.error("Falha ao atualizar permissões"),
  });

  

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Permissões</h1>
            <p className="text-muted-foreground mt-1">Gerencie as permissões de acesso</p>
          </div>
        </div>

        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle>Permissões por Usuário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!funcionarios && <p className="text-muted-foreground">Carregando usuários...</p>}
            {funcionarios?.results?.map((f: Funcionario) => {
              const perms = parsePerms(f.ui_permissoes ?? null);
              return (
                <div key={f.id} className="p-4 border rounded-md space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{f.nome}</p>
                      <p className="text-sm text-muted-foreground">{f.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={normalizeNivel(f.nivel_acesso) === "admin" ? "default" : "secondary"}>
                        {normalizeNivel(f.nivel_acesso) === "admin" ? "Administrador" : "Usuário Comum"}
                      </Badge>
                    </div>
                  </div>


                  {/* Permissões granulares (apenas para não-admins) */}
                  {normalizeNivel(f.nivel_acesso) !== "admin" && (
                    <div className="border-t pt-4">
                      <p className="font-medium mb-4">Permissões Granulares</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {([
                          { key: "dashboard", label: "Dashboard", desc: "Acesso ao painel principal" },
                          { key: "vendas", label: "Vendas", desc: "Gerenciar vendas e pedidos" },
                          { key: "clientes", label: "Clientes", desc: "Cadastrar e editar clientes" },
                          { key: "produtos", label: "Produtos", desc: "Gerenciar produtos e estoque" },
                          { key: "fornecedores", label: "Fornecedores", desc: "Gerenciar fornecedores" },
                          { key: "relatorios", label: "Relatórios", desc: "Visualizar relatórios" },
                        ] as { key: keyof UiPerms; label: string; desc: string }[]).map((m) => (
                          <div key={m.key} className="flex items-center justify-between">
                            <div>
                              <Label className="text-base">{m.label}</Label>
                              <p className="text-sm text-muted-foreground">{m.desc}</p>
                            </div>
                            <Switch
                              checked={perms[m.key]}
                              onCheckedChange={(val) => {
                                const next = { ...perms, [m.key]: val } as UiPerms;
                                updatePerms.mutate({ id: f.id, perms: next });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {normalizeNivel(f.nivel_acesso) === "admin" && (
                    <div className="border-t pt-4 text-sm text-muted-foreground">
                      <p>Administradores têm acesso a todas as funcionalidades</p>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
