export interface PartnerConfig {
  id: string;
  name: string;
  domains: string[]; // domains that belong to the partner
  defaultRole?: 'student' | 'professor' | 'admin';
  theme?: {
    from: string;
    to: string;
    // optional explicit hex colors for safe inline gradients in the UI
    fromHex?: string;
    toHex?: string;
  };
}

// Add partnered institutions here. Keep minimal information (id, domains, theme)
export const PARTNERS: PartnerConfig[] = [
  {
    id: 'babcock',
    name: 'Babcock University',
    domains: ['babcock.edu.ng', 'students.babcock.edu.ng'],
    defaultRole: 'student',
    theme: {
      from: 'indigo-700',
      to: 'emerald-500',
      fromHex: '#4f46e5',
      toHex: '#10B981',
    },
  },
];

export function getPartnerForEmail(email?: string) {
  if (!email) return null;
  const at = email.split('@');
  if (at.length < 2) return null;
  const domain = at[1].toLowerCase();

  for (const p of PARTNERS) {
    // Match exact domain or any subdomain that ends with the partner domain.
    for (const d of p.domains) {
      const dd = d.toLowerCase();
      if (domain === dd) return p;
      if (domain.endsWith('.' + dd)) return p;
    }
  }
  return null;
}

// A simple heuristic to decide whether an email from a partner should be
// considered a professor/instructor. This can be replaced with a DB-driven
// verification later.
export function inferRoleFromEmail(email: string, partner?: PartnerConfig) {
  const local = email.split('@')[0].toLowerCase();
  // common professor/staff prefixes
  const professorHints = ['prof', 'dr', 'lect', 'staff', 'faculty', 'admin'];
  for (const hint of professorHints) {
    if (local.includes(hint)) return 'professor';
  }

  // otherwise, return partner default or 'student'
  return (partner?.defaultRole as 'student' | 'professor' | 'admin') || 'student';
}

// A mapping from partner id -> safe Tailwind gradient classes. Keep explicit
// class strings so Tailwind JIT can detect and include them in the build.
export const PARTNER_TAILWIND_GRADIENTS: Record<string, string> = {
  babcock: 'bg-gradient-to-r from-indigo-700 to-emerald-500',
};

export function getPartnerGradientClass(partnerId?: string) {
  if (!partnerId) return undefined;
  return PARTNER_TAILWIND_GRADIENTS[partnerId];
}
