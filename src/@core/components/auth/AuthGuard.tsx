// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Imports
import { useRouter, usePathname } from 'next/navigation' // Updated import

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()
  const pathname = usePathname() // Get current pathname

  useEffect(
    () => {
      // No need for router.isReady check with next/navigation
      if (auth.user === null && !window.localStorage.getItem('userData')) {
        if (pathname !== '/') { // Use pathname
          router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`) // Construct URL manually
        } else {
          router.replace('/login')
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [auth.user, pathname, router] // Updated dependencies
  )

  if (auth.loading || auth.user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
