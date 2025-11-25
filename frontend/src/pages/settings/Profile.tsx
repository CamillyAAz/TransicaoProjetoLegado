import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { useState, useEffect } from "react";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setNome(user.nome || "");
      setEmail(user.email || "");
      // @ts-expect-error telefone pode não existir no tipo User
      setTelefone((user as unknown as { telefone?: string }).telefone || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    if (!nome || !email) {
      toast.error("Preencha nome e email");
      return;
    }
    try {
      setLoading(true);
      await api.updateFuncionario(user.id, { nome, email, telefone });
      toast.success("Perfil atualizado com sucesso");
    } catch (e: unknown) {
      const msg = typeof (e as Error)?.message === "string" ? (e as Error).message : "Falha ao atualizar perfil";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Perfil</h1>
            <p className="text-muted-foreground mt-1">Atualize suas informações pessoais</p>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={nome} onChange={(e) => setNome(e.target.value)} disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} disabled={loading} />
            </div>
            <Button onClick={handleSave} disabled={loading}>Salvar Alterações</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
