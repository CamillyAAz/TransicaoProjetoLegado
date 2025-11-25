import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
 
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/lib/permissions";
import { isValidCep, getCepData, formatCep } from "@/lib/utils";

interface Funcionario {
  id: number;
  nome: string;
  rg?: string | null;
  cpf?: string | null;
  email: string;
  cargo?: string | null;
  nivel_acesso?: string | null;
  telefone?: string | null;
  celular?: string | null;
  cep?: string | null;
  endereco?: string | null;
  numero?: number | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  is_active?: boolean;
  is_staff?: boolean;
}

export default function Employees() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const admin = isAdmin(user);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Funcionario | null>(null);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    rg: "",
    cpf: "",
    email: "",
    password: "",
    cargo: "",
    nivel_acesso: "usuário",
    telefone: "",
    celular: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  // Fetch employees data
  const { data, isLoading, error } = useQuery({
    queryKey: ["funcionarios"],
    queryFn: () => api.getFuncionarios(1),
  });

  // Extract the actual employees array from the paginated response
  const employees = data?.results || [];

  // Create employee mutation
  const createMutation = useMutation({
    mutationFn: api.createFuncionario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
      toast.success("Funcionário criado com sucesso");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erro ao criar funcionário");
    },
  });

  // Update employee mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Funcionario> }) => 
      api.updateFuncionario(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
      toast.success("Funcionário atualizado com sucesso");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erro ao atualizar funcionário");
    },
  });

  // Delete employee mutation
  const deleteMutation = useMutation({
    mutationFn: api.deleteFuncionario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
      toast.success("Funcionário removido com sucesso");
    },
    onError: () => {
      toast.error("Erro ao remover funcionário");
    },
  });

  const filteredEmployees = employees.filter(
    (emp: Funcionario) =>
      emp.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.cpf?.includes(searchTerm)
  );

  const handleCepChange = async (cep: string) => {
    setFormData({ ...formData, cep });
    const valido = isValidCep(cep);
    if (!valido) return;
    setIsLoadingCep(true);
    try {
      const dados = await getCepData(cep);
      setFormData(prev => ({
        ...prev,
        cep: dados.cep,
        endereco: dados.logradouro || prev.endereco,
        bairro: dados.bairro || prev.bairro,
        cidade: dados.cidade || prev.cidade,
        estado: dados.estado || prev.estado,
        complemento: dados.complemento || prev.complemento,
      }));
      toast.success("Endereço encontrado!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "CEP não encontrado";
      toast.error(msg);
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleSave = () => {
    if (!isAdmin) {
      toast.error("Ação permitida apenas para administradores");
      return;
    }
    if (!formData.nome || !formData.cpf || !formData.email || !formData.cargo) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const numeroParsed = formData.numero ? Number(formData.numero) : undefined;

    if (!editingEmployee) {
      if (!formData.password || formData.password.length < 8) {
        toast.error("Informe uma senha com pelo menos 8 caracteres");
        return;
      }
    }

    if (editingEmployee) {
      const payload: Partial<{
        nome: string;
        rg: string | null;
        cpf: string | null;
        email: string;
        password?: string;
        cargo: string | null;
        nivel_acesso: string | null;
        telefone: string | null;
        celular: string | null;
        cep: string | null;
        endereco: string | null;
        numero: number | null;
        complemento: string | null;
        bairro: string | null;
        cidade: string | null;
        estado: string | null;
      }> = {
        nome: formData.nome,
        rg: formData.rg || null,
        cpf: formData.cpf || null,
        email: formData.email,
        cargo: formData.cargo || null,
        nivel_acesso: formData.nivel_acesso || null,
        telefone: formData.telefone || null,
        celular: formData.celular || null,
        cep: formData.cep || null,
        endereco: formData.endereco || null,
        numero: numeroParsed ?? null,
        complemento: formData.complemento || null,
        bairro: formData.bairro || null,
        cidade: formData.cidade || null,
        estado: formData.estado || null,
      };
      if (formData.password) payload.password = formData.password;

      updateMutation.mutate({ id: editingEmployee.id, data: payload });
    } else {
      const payload: {
        nome: string;
        rg: string | null;
        cpf: string | null;
        email: string;
        password: string;
        cargo: string | null;
        nivel_acesso: string | null;
        telefone: string | null;
        celular: string | null;
        cep: string | null;
        endereco: string | null;
        numero: number | null;
        complemento: string | null;
        bairro: string | null;
        cidade: string | null;
        estado: string | null;
      } = {
        nome: formData.nome,
        rg: formData.rg || null,
        cpf: formData.cpf || null,
        email: formData.email,
        password: formData.password,
        cargo: formData.cargo || null,
        nivel_acesso: formData.nivel_acesso || null,
        telefone: formData.telefone || null,
        celular: formData.celular || null,
        cep: formData.cep || null,
        endereco: formData.endereco || null,
        numero: numeroParsed ?? null,
        complemento: formData.complemento || null,
        bairro: formData.bairro || null,
        cidade: formData.cidade || null,
        estado: formData.estado || null,
      };
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (employee: Funcionario) => {
    if (!isAdmin) {
      toast.error("Ação permitida apenas para administradores");
      return;
    }
    setEditingEmployee(employee);
    setFormData({
      nome: employee.nome || "",
      rg: employee.rg || "",
      cpf: employee.cpf || "",
      email: employee.email || "",
      password: "",
      cargo: employee.cargo || "",
      nivel_acesso: employee.nivel_acesso || "usuário",
      telefone: employee.telefone || "",
      celular: employee.celular || "",
      cep: employee.cep || "",
      endereco: employee.endereco || "",
      numero: employee.numero?.toString() || "",
      complemento: employee.complemento || "",
      bairro: employee.bairro || "",
      cidade: employee.cidade || "",
      estado: employee.estado || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (!isAdmin) {
      toast.error("Ação permitida apenas para administradores");
      return;
    }
    if (confirm("Tem certeza que deseja remover este funcionário?")) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      rg: "",
      cpf: "",
      email: "",
      password: "",
      cargo: "",
      nivel_acesso: "usuário",
      telefone: "",
      celular: "",
      cep: "",
      endereco: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
    });
    setEditingEmployee(null);
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Carregando funcionários...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-destructive">Erro ao carregar funcionários</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Funcionários</h1>
            <p className="text-muted-foreground mt-1">Gerencie sua equipe</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            {isAdmin && (
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Funcionário
                </Button>
              </DialogTrigger>
            )}
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>{editingEmployee ? "Editar Funcionário" : "Novo Funcionário"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome *</Label>
                    <Input
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CPF *</Label>
                    <Input
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>RG</Label>
                    <Input
                      value={formData.rg}
                      onChange={(e) => setFormData({ ...formData, rg: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cargo *</Label>
                    <Input
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Senha {editingEmployee ? "(deixe vazio para manter)" : "*"}</Label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="bg-background"
                      placeholder="mínimo 8 caracteres"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nível de Acesso *</Label>
                    <Select
                      value={formData.nivel_acesso}
                      onValueChange={(value) => setFormData({ ...formData, nivel_acesso: value })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="usuário">Usuário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Celular</Label>
                    <Input
                      value={formData.celular}
                      onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label>Endereço</Label>
                    <Input
                      value={formData.endereco}
                      onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Número</Label>
                    <Input
                      value={formData.numero}
                      onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>CEP</Label>
                    <Input
                      value={formData.cep}
                      onChange={(e) => {
                        const v = formatCep(e.target.value);
                        setFormData({ ...formData, cep: v });
                        handleCepChange(v);
                      }}
                      onBlur={(e) => handleCepChange(e.target.value)}
                      className="bg-background"
                      placeholder="00000-000"
                      maxLength={9}
                      disabled={isLoadingCep}
                    />
                    {isLoadingCep && <p className="text-xs text-muted-foreground">Buscando CEP...</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Complemento</Label>
                    <Input
                      value={formData.complemento}
                      onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Bairro</Label>
                    <Input
                      value={formData.bairro}
                      onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cidade</Label>
                    <Input
                      value={formData.cidade}
                      onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Input
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                      className="bg-background"
                      maxLength={2}
                      placeholder="SP"
                    />
                  </div>
                </div>

                

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleSave} 
                    className="flex-1"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? "Salvando..." : "Salvar"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar funcionários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="rounded-md border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee: Funcionario) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.nome || 'N/A'}</TableCell>
                  <TableCell>{employee.cpf || 'N/A'}</TableCell>
                  <TableCell>{employee.email || 'N/A'}</TableCell>
                  <TableCell>{employee.cargo || 'N/A'}</TableCell>
                  <TableCell>{employee.celular || employee.telefone || 'N/A'}</TableCell>
                  <TableCell>{employee.cidade || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/employees/${employee.id}`)}
                        title="Visualizar detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {admin && (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(employee)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(employee.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredEmployees.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum funcionário encontrado
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
