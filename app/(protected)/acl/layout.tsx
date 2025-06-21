// app/(protected)/acl/layout.tsx
'use client';
import AclGuard from 'src/@core/components/auth/AclGuard';
        // Removed: import { aclConfigs } from 'src/configs/acl';

export default function ACLPageLayout({ children }: { children: React.ReactNode }) {
  // Define abilities for this specific page/section
          const aclAbilities = { action: 'read', subject: 'acl-page' } as const; // Defined directly

          if (!aclAbilities) { // This check might be redundant now but kept for safety
    // Fallback or error if abilities for this page are not defined
    // This case should ideally not happen if configs are correct
    return <>Error: ACL abilities not configured for this page.</>;
  }

  return <AclGuard aclAbilities={aclAbilities} guestGuard={false}>{children}</AclGuard>;
}
