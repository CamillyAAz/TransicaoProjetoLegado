import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  Users,
  UsersRound,
  Truck,
  Package,
  ShoppingCart,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Painel", path: "/dashboard", icon: LayoutDashboard },
  { title: "Clientes", path: "/clients", icon: Users },
  { title: "Funcionários", path: "/employees", icon: UsersRound },
  { title: "Fornecedores", path: "/suppliers", icon: Truck },
  { title: "Produtos", path: "/products", icon: Package },
  { title: "Vendas", path: "/sales", icon: ShoppingCart },
  { title: "Configurações", path: "/settings", icon: Settings },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
          isCollapsed ? "w-16" : "w-60"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">ER</span>
                </div>
                <span className="font-semibold text-sidebar-foreground">ERP System</span>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-sidebar-accent rounded-md transition-colors"
            >
              {isCollapsed ? (
                <Menu className="h-5 w-5 text-sidebar-foreground" />
              ) : (
                <X className="h-5 w-5 text-sidebar-foreground" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className="flex items-center gap-3 px-3 py-2.5 text-sidebar-foreground rounded-md hover:bg-sidebar-accent transition-colors"
                    activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
      {/* Spacer */}
      <div className={cn("transition-all duration-300", isCollapsed ? "w-16" : "w-60")} />
    </>
  );
}
