// ** React Imports
import { ReactNode, useContext } from 'react'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Types
import { NavLink } from 'src/@core/layouts/types'

interface Props {
  navLink?: NavLink
  children: ReactNode
}

const CanViewNavLink = (props: Props) => {
  // ** Props
  const { children, navLink } = props

  // const { features } = JSON.parse(window.localStorage.getItem('userData'))
  // console.log('here',navLink)
  // if (navLink?.access) {
  //   console.log('here')
  //   if (features.includes(navLink.access)) {
  //     return <>{children}</>
  //   } else {
  //     return null
  //   }
  // }
  //
  // return <>{children}</>

  // ** Hook
  const ability = useContext(AbilityContext)

  return ability && ability.can(navLink?.action, navLink?.subject) ? <>{children}</> : null
}

export default CanViewNavLink
