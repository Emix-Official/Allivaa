"use client";

import { useEffect } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { PARTNERS } from '@/config/partners';

export default function PartnerThemeProvider() {
  const profile = useProfileStore((s) => s.profile);

  useEffect(() => {
    const partnerId = profile?.partner;
    if (!partnerId) {
      // remove any partner variables
      document.documentElement.style.removeProperty('--partner-from');
      document.documentElement.style.removeProperty('--partner-to');
      document.documentElement.classList.remove('partner-active');
      return;
    }

    const partner = PARTNERS.find((p) => p.id === partnerId);
    if (!partner) return;

    // Prefer explicit hex colors if provided
    const from = partner.theme?.fromHex || '#4f46e5';
    const to = partner.theme?.toHex || '#10B981';

    document.documentElement.style.setProperty('--partner-from', from);
    document.documentElement.style.setProperty('--partner-to', to);
    document.documentElement.classList.add('partner-active');
  }, [profile?.partner]);

  return null;
}
