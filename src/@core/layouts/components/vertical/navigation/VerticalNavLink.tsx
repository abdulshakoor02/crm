// ** React Imports
import { ElementType, ReactNode } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Chip from '@mui/material/Chip'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import { styled, useTheme, alpha } from '@mui/material/styles' // Added alpha
import ListItemButton, { ListItemButtonProps } from '@mui/material/ListItemButton'

// ** Configs Import
import themeConfig from 'src/configs/themeConfig'

// ** Types
import { NavLink, NavGroup } from 'src/@core/layouts/types'
import { Settings } from 'src/@core/context/settingsContext'

// ** Custom Components Imports
import UserIcon from 'src/layouts/components/UserIcon'
import Translations from 'src/layouts/components/Translations'
import CanViewNavLink from 'src/layouts/components/acl/CanViewNavLink'

// ** Utils
import { handleURLQueries } from 'src/@core/layouts/utils'

interface Props {
  parent?: boolean
  item: NavLink
  navHover?: boolean
  settings: Settings
  navVisible?: boolean
  collapsedNavWidth: number
  navigationBorderWidth: number
  toggleNavVisibility: () => void
  isSubToSub?: NavGroup | undefined
}

// ** Styled Components
const MenuNavLink = styled(ListItemButton)<
  ListItemButtonProps & { component?: ElementType; target?: '_blank' | undefined }
>(({ theme }) => ({
  width: '100%',
  borderTopRightRadius: 12,
  borderBottomRightRadius: 12,
  color: theme.palette.common.white,
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: 3,
    height: '100%',
    backgroundColor: theme.palette.common.white,
    transform: 'scaleY(0)',
    transition: 'transform 0.3s ease',
  },
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.08)',
    transform: 'translateX(2px)',
    '&:before': {
      transform: 'scaleY(1)',
    },
  },
  '&.active': {
    backgroundColor: 'rgba(255,255,255,0.15)',
    transform: 'translateX(4px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    '&:before': {
      transform: 'scaleY(1)',
    },
    '&, &:hover': {
      backgroundColor: 'rgba(255,255,255,0.15)',
    },
    '& .MuiTypography-root, & .MuiListItemIcon-root': {
      color: `${theme.palette.common.white} !important`
    },
    '& .MuiTypography-root': {
      fontWeight: theme.typography.fontWeightMedium
    }
  }
}))

const MenuItemTextMetaWrapper = styled(Box)<BoxProps>({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  ...(themeConfig.menuTextTruncate && { overflow: 'hidden' })
})

const VerticalNavLink = ({
  item,
  parent,
  navHover,
  settings,
  navVisible,
  isSubToSub,
  collapsedNavWidth,
  toggleNavVisibility,
  navigationBorderWidth
}: Props) => {
  // ** Hooks
  const theme = useTheme()
  const router = useRouter()

  // ** Vars
  const { skin, navCollapsed } = settings

  const IconTag: ReactNode = parent && !item.icon ? themeConfig.navSubItemIcon : item.icon

  const conditionalBgColor = () => {
    if (skin === 'semi-dark' && theme.palette.mode === 'light') {
      return {
        color: `rgba(${theme.palette.customColors.dark}, 0.87)`,
        '&:hover': {
          backgroundColor: `rgba(${theme.palette.customColors.dark}, 0.04)`
        }
      }
    } else if (skin === 'semi-dark' && theme.palette.mode === 'dark') {
      return {
        color: `rgba(${theme.palette.customColors.light}, 0.87)`,
        '&:hover': {
          backgroundColor: `rgba(${theme.palette.customColors.light}, 0.04)`
        }
      }
    } else return {}
  }

  const checkAccess = () => {
    if (item?.access) {
      const { features } = JSON.parse(window.localStorage.getItem('userData'));
      if (features.includes(item.access)) {

      return true
      } else {

      return false
      }
    }

    return true
   }

  const isNavLinkActive = () => {
    if (router.pathname === item.path || handleURLQueries(router, item.path)) {
      return true
    } else {
      return false
    }
  }

  return (
  <>{ checkAccess() && (
    <CanViewNavLink navLink={item}>
      <ListItem
        disablePadding
        className='nav-link'
        disabled={item.disabled || false}
        sx={{ mt: 0.5, mb: 0.5, px: '0 !important' }}
      >
        <Link passHref href={item.path === undefined ? '/' : `${item.path}`}>
          <MenuNavLink
            component={'a'}
            className={isNavLinkActive() ? 'active' : ''}
            {...(item.openInNewTab ? { target: '_blank' } : null)}
            aria-current={isNavLinkActive() ? 'page' : undefined}
            onClick={e => {
              if (item.path === undefined) {
                e.preventDefault()
                e.stopPropagation()
              }
              if (navVisible) {
                toggleNavVisibility()
              }
            }}
            sx={{
              py: {
                xs: theme.spacing(2),
                md: theme.spacing(2.5)
              },
              ...conditionalBgColor(),
              ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' }),
              pl: navCollapsed && !navHover ? (collapsedNavWidth - navigationBorderWidth - 24) / 8 : 5.5,
              pr: navCollapsed && !navHover ? ((collapsedNavWidth - navigationBorderWidth - 24) / 2 - 5) / 4 : 3.5,
              minHeight: { xs: 44, md: 'auto' }
            }}
          >
            {isSubToSub ? null : (
              <ListItemIcon
                sx={{
                  color: 'text.primary',
                  transition: 'margin .25s ease-in-out',
                  fontSize: '1.25rem',
                  ...(navCollapsed && !navHover ? { mr: 0 } : { mr: 2.5 }),
                  ...(parent ? { ml: 1.25, mr: 3.75 } : {})
                }}
              >
                <UserIcon
                  icon={IconTag}
                  componentType='vertical-menu'
                  iconProps={{
                    sx: {
                      fontSize: '1.25rem',
                      ...(parent ? { fontSize: '1rem' } : {})
                    }
                  }}
                />
              </ListItemIcon>
            )}

            <MenuItemTextMetaWrapper
              sx={{
                ...(isSubToSub ? { ml: 9 } : {}),
                ...(navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 })
              }}
            >
              <Typography
                {...((themeConfig.menuTextTruncate || (!themeConfig.menuTextTruncate && navCollapsed && !navHover)) && {
                  noWrap: true
                })}
              >
                <Translations text={item.title} />
              </Typography>
              {item.badgeContent ? (
                <Chip
                  label={item.badgeContent}
                  color={item.badgeColor || 'primary'}
                  sx={{
                    ml: 1.25,
                    height: 20,
                    fontWeight: 500,
                    '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' }
                  }}
                />
              ) : null}
            </MenuItemTextMetaWrapper>
          </MenuNavLink>
        </Link>
      </ListItem>
    </CanViewNavLink>)
  }</>)
}

export default VerticalNavLink
