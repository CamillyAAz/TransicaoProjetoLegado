type UiPerms = {
  dashboard: boolean;
  vendas: boolean;
  clientes: boolean;
  produtos: boolean;
  fornecedores: boolean;
  relatorios: boolean;
};

export function normalizeNivel(n?: string | null): 'admin' | 'user' {
  const s = (n || '').toLowerCase();
  if (['admin', 'administrador'].includes(s)) return 'admin';
  if (['usuario', 'usuário', 'user'].includes(s)) return 'user';
  return 'user';
}

export function parseUiPerms(s?: string | null): UiPerms {
  try {
    const obj = s ? JSON.parse(s) : {};
    return {
      dashboard: obj.dashboard ?? false,
      vendas: obj.vendas ?? false,
      clientes: obj.clientes ?? false,
      produtos: obj.produtos ?? false,
      fornecedores: obj.fornecedores ?? false,
      relatorios: obj.relatorios ?? false,
    };
  } catch {
    return { dashboard: false, vendas: false, clientes: false, produtos: false, fornecedores: false, relatorios: false };
  }
}

export function isAdmin(user: { nivel_acesso?: string | null } | null): boolean {
  return normalizeNivel(user?.nivel_acesso) === 'admin';
}

export function canAccessPath(user: { nivel_acesso?: string | null; ui_permissoes?: string | null } | null, path: string): boolean {
  if (isAdmin(user)) return true;
  const p = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
  const base = new Set(['/sales', '/products', '/clients', '/settings', '/settings/change-password', '/settings/profile']);
  if (!base.has(p)) return false;
  if (p.startsWith('/settings')) return true;
  const perms = parseUiPerms(user?.ui_permissoes);
  const map: Record<string, keyof UiPerms> = { '/sales': 'vendas', '/products': 'produtos', '/clients': 'clientes' };
  const key = map[p];
  return key ? !!perms[key] : false;
}

export function canEditProducts(user: { nivel_acesso?: string | null } | null): boolean {
  return isAdmin(user);
}

