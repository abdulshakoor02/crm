'use client';
// ** React Imports
import { ElementType, Fragment } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation' // Updated import

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import { styled, alpha } from '@mui/material/styles' // Added alpha
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import MuiListItem, { ListItemProps } from '@mui/material/ListItem'

// ** Third Party Imports
import clsx from 'clsx'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'

// ** Types
import { NavLink } from 'src/@core/layouts/types'
import { Settings } from 'src/@core/context/settingsContext'

// ** Custom Components Imports
import UserIcon from 'src/layouts/components/UserIcon'
import Translations from 'src/layouts/components/Translations'
import CanViewNavLink from 'src/layouts/components/acl/CanViewNavLink'

// ** Util Import
// import { hexToRGBA } from 'src/@core/utils/hex-to-rgba' // hexToRGBA no longer needed, replaced by alpha

interface Props {
  item: NavLink
  settings: Settings
  hasParent: boolean
}

const ListItem = styled(MuiListItem)<ListItemProps & { component?: ElementType; target?: '_blank' | undefined }>(
  ({ theme }) => ({
    width: 'auto',
    paddingTop: theme.spacing(2.5), // Updated padding
    color: theme.palette.text.primary,
    paddingBottom: theme.spacing(2.5), // Updated padding
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    },
    '&.active, &.active:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1), // Updated background for hasParent and base
      '& .MuiTypography-root': { // Added for all active items
        fontWeight: theme.typography.fontWeightMedium
      }
    },
    '&.active .MuiTypography-root, &.active .MuiListItemIcon-root': { // Existing color rule, still good for hasParent
      color: theme.palette.primary.main
    }
  })
)

const HorizontalNavLink = (props: Props) => {
  // ** Props
  const { item, settings, hasParent } = props

  // ** Hook & Vars
  const router = useRouter() // from next/navigation
  const pathname = usePathname() // from next/navigation
  const searchParams = useSearchParams() // from next/navigation
  const { navSubItemIcon, menuTextTruncate } = themeConfig

  const IconTag = item.icon ? item.icon : navSubItemIcon

  const Wrapper = !hasParent ? List : Fragment

  // const handleURLQueries = () => { // Original local handleURLQueries
  //   if (Object.keys(router.query).length && item.path) {
  //     const arr = Object.keys(router.query)
  //     return router.asPath.includes(item.path) && router.asPath.includes(router.query[arr[0]] as string)
  //   }
  // }
  // Updated isNavLinkActive to use pathname and a simplified check for App Router
  // For more complex query matching, searchParams would be used here.
  const isNavLinkActive = () => {
    if (pathname === item.path) {
      return true;
    }
    // Basic check if pathname starts with item.path (for nested routes)
    // and item.path is not just '/'
    if (item.path && item.path !== '/' && pathname.startsWith(item.path)) {
      return true;
    }
    return false
    }
  }

  return (
    <CanViewNavLink navLink={item}>
      <Wrapper {...(!hasParent ? { component: 'div', sx: { py: settings.skin === 'bordered' ? 2.625 : 2.75 } } : {})}>
        <Link href={`${item.path}`} passHref>
          <ListItem
            component={'a'}
            disabled={item.disabled}
            className={clsx({ active: isNavLinkActive() })}
            target={item.openInNewTab ? '_blank' : undefined}
            onClick={e => {
              if (item.path === undefined) {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
            sx={{
              ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' }),
              ...(!hasParent
                ? {
                    px: 5.5,
                    borderRadius: 3.5,
                    '&.active, &.active:hover': {
                      // Removed boxShadow and backgroundImage
                      backgroundColor: alpha(theme.palette.primary.main, 0.1), // Explicitly set for !hasParent active
                      '& .MuiTypography-root, & .MuiListItemIcon-root': {
                        color: theme.palette.primary.main // Changed from common.white
                      }
                      // fontWeight for typography is handled by the main styled component's active style
                    }
                  }
                : { px: 5 })
            }}
          >
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  ...(menuTextTruncate && { overflow: 'hidden' })
                }}
              >
                <ListItemIcon sx={{ color: 'text.primary', mr: !hasParent ? 2 : 3 }}>
                  <UserIcon
                    icon={IconTag}
                    componentType='horizontal-menu'
                    iconProps={{ sx: IconTag === navSubItemIcon ? { fontSize: '0.875rem' } : { fontSize: '1.375rem' } }}
                  />
                </ListItemIcon>
                <Typography {...(menuTextTruncate && { noWrap: true })}>
                  <Translations text={item.title} />
                </Typography>
              </Box>
              {item.badgeContent ? (
                <Chip
                  label={item.badgeContent}
                  color={item.badgeColor || 'primary'}
                  sx={{
                    ml: 1.6,
                    height: 20,
                    fontWeight: 500,
                    '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' }
                  }}
                />
              ) : null}
            </Box>
          </ListItem>
        </Link>
      </Wrapper>
    </CanViewNavLink>
  )
}

export default HorizontalNavLink
