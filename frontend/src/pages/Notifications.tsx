import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Package, DollarSign, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { api, NotificationItem } from "@/services/api";
import { useEffect, useMemo, useState } from "react";

const typeColors = {
  info: "bg-blue-500/10 text-blue-500",
  warning: "bg-yellow-500/10 text-yellow-500",
  success: "bg-green-500/10 text-green-500",
  error: "bg-red-500/10 text-red-500",
};

const typeIcon = {
  info: Bell,
  warning: Package,
  success: DollarSign,
  error: AlertTriangle,
};

export default function Notifications() {
  const { user } = useAuth();
  const { data: notifications = [] } = useQuery<NotificationItem[]>({
    queryKey: ["notifications"],
    queryFn: api.getNotifications,
  });
  const storageKey = useMemo(() => `notifications_read_${user?.id ?? "anon"}`, [user?.id]);
  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    let parsed: string[] = [];
    if (saved) {
      try {
        parsed = JSON.parse(saved);
      } catch {
        parsed = [];
      }
    }
    setReadIds(parsed);
  }, [storageKey]);

  const markAllRead = () => {
    const ids = notifications.map((n) => n.id);
    setReadIds(ids);
    try {
      localStorage.setItem(storageKey, JSON.stringify(ids));
    } catch {
      void 0;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notificações</h1>
            <p className="text-muted-foreground mt-1">Acompanhe todas as atualizações do sistema</p>
          </div>
          <Button variant="outline" onClick={markAllRead}>Marcar todas como lidas</Button>
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = typeIcon[notification.type];
            const isRead = readIds.includes(notification.id);
            return (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md ${
                  !isRead ? "border-primary/50 bg-primary/5" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${typeColors[notification.type]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-foreground">{notification.title}</h3>
                        {!isRead && (
                          <Badge variant="default" className="ml-2">Nova</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.time).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
