import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Language() {
  const navigate = useNavigate();

  const handleSave = () => {
    toast.success("Idioma alterado com sucesso");
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Idioma</h1>
            <p className="text-muted-foreground mt-1">Escolha o idioma de sua preferência</p>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Selecione o Idioma</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup defaultValue="pt-br">
              <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted cursor-pointer">
                <RadioGroupItem value="pt-br" id="pt-br" />
                <Label htmlFor="pt-br" className="cursor-pointer flex-1">
                  <p className="font-medium">Português (Brasil)</p>
                  <p className="text-sm text-muted-foreground">Portuguese (Brazil)</p>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted cursor-pointer">
                <RadioGroupItem value="en" id="en" />
                <Label htmlFor="en" className="cursor-pointer flex-1">
                  <p className="font-medium">English</p>
                  <p className="text-sm text-muted-foreground">Inglês</p>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted cursor-pointer">
                <RadioGroupItem value="es" id="es" />
                <Label htmlFor="es" className="cursor-pointer flex-1">
                  <p className="font-medium">Español</p>
                  <p className="text-sm text-muted-foreground">Espanhol</p>
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
