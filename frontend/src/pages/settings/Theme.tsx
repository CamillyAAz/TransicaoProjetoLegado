import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Sun, Moon, Monitor } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

export default function Theme() {
  const navigate = useNavigate();
  const [value, setValue] = useState<"light" | "dark" | "system">("system");
  const mediaRef = useRef<MediaQueryList | null>(null);

  const applyTheme = (pref: "light" | "dark" | "system") => {
    const root = document.documentElement;
    if (pref === "system") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      mediaRef.current = mql;
      root.classList.toggle("dark", mql.matches);
    } else {
      root.classList.toggle("dark", pref === "dark");
    }
  };

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as "light" | "dark" | "system" | null) ?? "system";
    setValue(saved);
    applyTheme(saved);
    if (saved === "system") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e: MediaQueryListEvent) => {
        document.documentElement.classList.toggle("dark", e.matches);
      };
      mql.addEventListener("change", handler);
      mediaRef.current = mql;
      return () => mql.removeEventListener("change", handler);
    }
  }, []);

  const onChange = (val: "light" | "dark" | "system") => {
    setValue(val);
    localStorage.setItem("theme", val);
    applyTheme(val);
  };

  const handleSave = () => {
    toast.success("Tema alterado com sucesso");
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tema</h1>
            <p className="text-muted-foreground mt-1">Selecione Claro, Escuro ou Sistema</p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={value} onValueChange={(v) => onChange(v as "light" | "dark" | "system") }>
              <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted cursor-pointer">
                <RadioGroupItem value="light" id="light" />
                <Sun className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="light" className="cursor-pointer flex-1">
                  <p className="font-medium">Claro</p>
                  <p className="text-sm text-muted-foreground">Tema com cores claras</p>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted cursor-pointer">
                <RadioGroupItem value="dark" id="dark" />
                <Moon className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="dark" className="cursor-pointer flex-1">
                  <p className="font-medium">Escuro</p>
                  <p className="text-sm text-muted-foreground">Tema com cores escuras</p>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted cursor-pointer">
                <RadioGroupItem value="system" id="system" />
                <Monitor className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="system" className="cursor-pointer flex-1">
                  <p className="font-medium">Sistema</p>
                  <p className="text-sm text-muted-foreground">Usar configuração do sistema</p>
                </Label>
              </div>
            </RadioGroup>
            <Button onClick={handleSave}>Salvar Alterações</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
