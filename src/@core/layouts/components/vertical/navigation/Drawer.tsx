// ** React Imports
import { ReactNode } from 'react'

// ** MUI Imports
import { styled, useTheme, alpha } from '@mui/material/styles' // Added alpha
import MuiSwipeableDrawer, { SwipeableDrawerProps } from '@mui/material/SwipeableDrawer'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

interface Props {
  hidden: boolean
  navWidth: number
  navHover: boolean
  settings: Settings
  navVisible: boolean
  children: ReactNode
  collapsedNavWidth: number
  navigationBorderWidth: number
  setNavHover: (values: boolean) => void
  setNavVisible: (value: boolean) => void
}

const SwipeableDrawer = styled(MuiSwipeableDrawer)<SwipeableDrawerProps>({
  overflowX: 'hidden',
  transition: 'width .25s ease-in-out',
  '& ul': {
    listStyle: 'none'
  },
  '& .MuiListItem-gutters': {
    paddingLeft: 4,
    paddingRight: 4
  },
  '& .MuiDrawer-paper': {
    left: 'unset',
    right: 'unset',
    overflowX: 'hidden',
    transition: 'width .25s ease-in-out, box-shadow .25s ease-in-out'
  }
})

const Drawer = (props: Props) => {
  // ** Props
  const {
    hidden,
    children,
    navHover,
    navWidth,
    settings,
    navVisible,
    setNavHover,
    setNavVisible,
    collapsedNavWidth,
    navigationBorderWidth
  } = props

  // ** Hook
  const theme = useTheme()

  // ** Vars
  const { skin, navCollapsed } = settings

  const drawerColor = () => {
    if (skin === 'semi-dark' && theme.palette.mode === 'light') {
      return {
        '& .MuiTypography-root, & .MuiSvgIcon-root': {
          color: `rgba(${theme.palette.customColors.dark}, 0.87)`
        }
      }
    } else if (skin === 'semi-dark' && theme.palette.mode === 'dark') {
      return {
        '& .MuiTypography-root, & .MuiSvgIcon-root': {
          color: `rgba(${theme.palette.customColors.light}, 0.87)`
        }
      }
    } else return {}
  }

  const drawerBgColor = () => {
    if (skin === 'semi-dark' && theme.palette.mode === 'light') {
      return {
        backgroundColor: theme.palette.customColors.darkBg
      }
    } else if (skin === 'semi-dark' && theme.palette.mode === 'dark') {
      return {
        backgroundColor: theme.palette.customColors.lightBg
      }
    } else {
      // Frosted glass effect for default and bordered skins
      return {
        backgroundColor: alpha(theme.palette.background.default, 0.85),
        backdropFilter: 'blur(6px)'
      }
    }
  }

  // Drawer Props for Mobile & Tablet screens
  const MobileDrawerProps = {
    open: navVisible,
    onOpen: () => setNavVisible(true),
    onClose: () => setNavVisible(false),
    ModalProps: {
      keepMounted: true // Better open performance on mobile.
    }
  }

  // Drawer Props for Desktop screens
  const DesktopDrawerProps = {
    open: true,
    onOpen: () => null,
    onClose: () => null,
    onMouseEnter: () => {
      setNavHover(true)
    },
    onMouseLeave: () => {
      setNavHover(false)
    }
  }

  return (
    <SwipeableDrawer
      className='layout-vertical-nav'
      variant={hidden ? 'temporary' : 'permanent'}
      {...(hidden ? { ...MobileDrawerProps } : { ...DesktopDrawerProps })}
      PaperProps={{ sx: { width: navCollapsed && !navHover ? collapsedNavWidth : navWidth } }}
      sx={{
        width: navCollapsed ? collapsedNavWidth : navWidth,
        '& .MuiDrawer-paper': {
          ...drawerColor(),
          ...drawerBgColor(),
          ...(!hidden && navCollapsed && navHover ? { boxShadow: 9 } : {}),
          borderRight: navigationBorderWidth === 0 ? 0 : `${navigationBorderWidth}px solid ${theme.palette.divider}`
        }
      }}
    >
      {children}
    </SwipeableDrawer>
  )
}

export default Drawer
