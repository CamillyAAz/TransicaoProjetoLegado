import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (email && password) {
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } else {
      toast.error("Por favor, preencha todos os campos");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="h-16 w-16 rounded-lg bg-primary flex items-center justify-center mb-4">
              <span className="text-primary-foreground font-bold text-2xl">ER</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">ERP System</h1>
            <p className="text-muted-foreground mt-2">Sistema de Gestão Empresarial</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email do Funcionário</Label>
              <Input
                id="email"
                type="email"
                placeholder="funcionario@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-border"
              />
            </div>

            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Esqueceu sua senha?{" "}
            <a href="#" className="text-primary hover:underline">
              Recuperar acesso
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
