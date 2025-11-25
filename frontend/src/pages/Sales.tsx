import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Plus, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NewSaleModal } from "@/components/NewSaleModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/lib/permissions";
import { toast } from "sonner";

interface Venda {
  id: number;
  cliente: number;
  cliente_nome?: string;
  funcionario: number;
  funcionario_nome?: string;
  data_venda: string;
  total: string;
  status: string;
  observacoes: string;
}

export default function Sales() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Venda | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsId, setDetailsId] = useState<number | null>(null);
  const { user } = useAuth();
  const admin = isAdmin(user);
  // Comentário: usuários não-admin possuem CRUD completo em Vendas
  const canManageSales = true;

  // Fetch sales data
  const { data: vendasData, isLoading, error } = useQuery({
    queryKey: ["vendas"],
    queryFn: () => api.getVendas(1),
  });
  const vendas = vendasData?.results || [];

  // Detalhes da venda (visualização para usuários via modal)
  const { data: vendaDetalhe, isLoading: isLoadingDetalhe } = useQuery({
    queryKey: ["venda", detailsId],
    queryFn: () => (detailsId ? api.getVenda(detailsId) : Promise.resolve(undefined)),
    enabled: isDetailsOpen && !!detailsId,
  });

  // Create sale mutation
  const createVendaMutation = useMutation({
    mutationFn: api.createVenda,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendas"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Venda criada com sucesso!");
      setIsNewSaleOpen(false);
    },
    onError: () => {
      toast.error("Erro ao criar venda");
    },
  });

  // Delete sale mutation
  const deleteSaleMutation = useMutation({
    mutationFn: api.deleteVenda,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendas"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Venda removida com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao remover venda");
    },
  });

  // Update sale mutation
  const updateSaleMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Venda> }) => api.updateVenda(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendas"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Venda atualizada com sucesso!");
      setIsEditOpen(false);
      setSelectedSale(null);
    },
    onError: () => {
      toast.error("Erro ao atualizar venda");
    },
  });

  const handleDeleteSale = (id: number) => {
    // Comentário: exclusão permitida para usuários não-admin
    if (confirm("Tem certeza que deseja remover esta venda?")) {
      deleteSaleMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Carregando vendas...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-destructive">Erro ao carregar vendas</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Vendas</h1>
            <p className="text-muted-foreground mt-1">Gerencie suas vendas</p>
          </div>
          <div className="flex gap-3">
            {canManageSales && (
              <Button onClick={() => setIsNewSaleOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Venda
              </Button>
            )}
            {admin && (
              <Button variant="outline" onClick={() => navigate("/sales/report")}> 
                Ver Relatório de Vendas
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-md border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID do Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendas.map((venda: Venda) => (
                <TableRow key={venda.id}>
                  <TableCell className="font-medium">#{venda.id}</TableCell>
                  <TableCell>{venda.cliente_nome || `Cliente ${venda.cliente}`}</TableCell>
                  <TableCell>{venda.funcionario_nome || `Funcionário ${venda.funcionario}`}</TableCell>
                  <TableCell>{new Date(venda.data_venda).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <Badge variant={venda.status === "Concluído" ? "default" : "secondary"}>
                      {venda.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    R$ {parseFloat(venda.total).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (admin) {
                            navigate(`/sales/${venda.id}`);
                          } else {
                            setDetailsId(venda.id);
                            setIsDetailsOpen(true);
                          }
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {canManageSales && (
                        <>
                          {/* Comentário: edição de venda habilitada via modal, sem navegar para rota proibida */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedSale(venda);
                              setIsEditOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSale(venda.id)}
                            disabled={deleteSaleMutation.isPending}
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
          {vendas.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma venda encontrada
            </div>
          )}
        </div>
      </div>

      {/* Comentário: criação de venda (permitida para usuários) */}
      <NewSaleModal 
        open={isNewSaleOpen} 
        onOpenChange={setIsNewSaleOpen}
        onSaleCreated={(vendaData) => createVendaMutation.mutate(vendaData)}
        mode="create"
      />
      {/* Comentário: edição de venda (permitida para usuários) */}
      <NewSaleModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        initialSale={selectedSale}
        mode="edit"
        onSaleUpdated={(id, data) => updateSaleMutation.mutate({ id, data })}
      />

      {/* Visualização de detalhes para usuários via modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Venda {detailsId ? `#${detailsId}` : ""}</DialogTitle>
          </DialogHeader>
          {!vendaDetalhe || isLoadingDetalhe ? (
            <div className="py-8 text-center text-muted-foreground">Carregando detalhes...</div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium">{vendaDetalhe.cliente_nome || vendaDetalhe.cliente || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Responsável</p>
                  <p className="font-medium">{vendaDetalhe.funcionario_nome || vendaDetalhe.funcionario || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{vendaDetalhe.status}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-medium">{new Date(vendaDetalhe.data_venda).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-bold">R$ {Number(vendaDetalhe.total).toFixed(2)}</p>
                </div>
              </div>
              <div className="rounded-md border border-border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Qtd</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(vendaDetalhe.itens || []).map((it, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{it.produto_descricao || `#${it.produto}`}</TableCell>
                        <TableCell>{it.quantidade}</TableCell>
                        <TableCell>R$ {Number(it.preco_unitario).toFixed(2)}</TableCell>
                        <TableCell className="text-right">R$ {Number(it.subtotal).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    {!(vendaDetalhe.itens && vendaDetalhe.itens.length) && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">Nenhum item</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
