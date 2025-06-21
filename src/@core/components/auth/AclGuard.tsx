'use client';
// ** React Imports
import { ReactNode, useState, useEffect } from 'react' // Added useEffect for router changes

// ** Next Imports
import { useRouter, usePathname } from 'next/navigation' // Updated import

// ** Types
import type { ACLObj, AppAbility } from 'src/configs/acl'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Config Import
import { buildAbilityFor } from 'src/configs/acl'

// ** Component Import
import Error401Page from 'src/app/401/page' // Updated import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

interface AclGuardProps {
  children: ReactNode
  guestGuard: boolean
  aclAbilities: ACLObj
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { aclAbilities, children, guestGuard } = props

  const [ability, setAbility] = useState<AppAbility | undefined>(undefined)

  // ** Hooks
  const auth = useAuth()
  const router = useRouter()
  const pathname = usePathname() // Get current pathname

  // ** State for ability (moved out of useEffect for initial check)
  // const [ability, setAbility] = useState<AppAbility | undefined>(buildAbilityFor(auth.user?.role, aclAbilities.subject));
  // Re-evaluate ability on user or role change.
  // useEffect(() => {
  //   if (auth.user && auth.user.role) {
  //     setAbility(buildAbilityFor(auth.user.role, aclAbilities.subject));
  //   } else {
  //     setAbility(undefined); // Clear ability if user is logged out
  //   }
  // }, [auth.user, aclAbilities.subject]);
  // Simplified: ability is derived directly in render logic for now to avoid complex useEffect

  // If guestGuard is true and user is not logged in or its an error page, render the page without checking access
  // Note: router.route is not available. Using pathname.
  if (guestGuard || pathname === '/404' || pathname === '/500' || pathname === '/') { // TODO: Ensure /404 and /500 are correct App Router paths for error pages
    return <>{children}</>
  }

  // User is logged in, build ability for the user based on his role
  let currentAbility: AppAbility | undefined = undefined;
  if (auth.user && auth.user.role) {
    currentAbility = buildAbilityFor(auth.user.role, aclAbilities.subject);
  }

  // Check the access of current user and render pages
  // Also check if ability is defined (user is logged in and role is processed)
  if (currentAbility && currentAbility.can(aclAbilities.action, aclAbilities.subject)) {
    return <AbilityContext.Provider value={currentAbility}>{children}</AbilityContext.Provider>
  }

  // Render Not Authorized component if the current user has limited access
  return (
    <BlankLayout>
      <Error401Page />
    </BlankLayout>
  )
}

export default AclGuard
