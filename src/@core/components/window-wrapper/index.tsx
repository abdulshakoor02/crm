'use client';
// ** React Imports
import { useState, useEffect, ReactNode } from 'react'

// ** Next Import
import { usePathname } from 'next/navigation' // Changed from next/router

interface Props {
  children: ReactNode
}

const WindowWrapper = ({ children }: Props) => {
  // ** State
  const [windowReadyFlag, setWindowReadyFlag] = useState<boolean>(false)

  const pathname = usePathname() // Changed from useRouter().route

  useEffect(
    () => {
      if (typeof window !== 'undefined') {
        setWindowReadyFlag(true)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname] // Changed dependency to pathname
  )

  if (windowReadyFlag) {
    return <>{children}</>
  } else {
    // Optionally, render a loader here instead of null if children are critical for layout
    return null
  }
}

export default WindowWrapper
