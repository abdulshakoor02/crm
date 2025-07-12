// ** React Imports
import { useState, SyntheticEvent, Fragment } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled, useTheme } from '@mui/material/styles' // Added useTheme
import Typography from '@mui/material/Typography'

// ** Icons Imports
import CogOutline from 'mdi-material-ui/CogOutline'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import LogoutVariant from 'mdi-material-ui/LogoutVariant'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import MessageOutline from 'mdi-material-ui/MessageOutline'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'

interface Props {
  settings: Settings
}

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = (props: Props) => {
  // ** Props
  const { settings } = props

  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  // ** Hooks
  const router = useRouter()
  const { logout } = useAuth()
  const theme = useTheme() // Added useTheme hook

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      fontSize: '1.375rem',
      color: 'text.secondary'
    }
  }

  const handleLogout = () => {
    logout()
    handleDropdownClose()
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Avatar
          alt='John Doe'
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src='/images/avatars/1.png'
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4, background: theme.palette.customColors.primaryGradient, color: 'common.white' } }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: direction === 'ltr' ? 'right' : 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: direction === 'ltr' ? 'right' : 'left'
        }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <Avatar
                alt='John Doe'
                src='/images/avatars/1.png'
                sx={{ width: '2.5rem', height: '2.5rem' }}
              />
            </Badge>
            <Box
              sx={{
                ml: 3,
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column'
              }}
            >
              <Typography sx={{ fontWeight: 600, color: 'common.white' }}>John Doe</Typography>
              <Typography
                variant='body2'
                sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}
              >
                Admin
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 0, mb: 1, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        <MenuItem sx={{ p: 0, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }} onClick={() => handleDropdownClose()}>
          <Box sx={{...styles, color: 'common.white', '& svg': { color: 'common.white' }}}>
            <AccountOutline sx={{ mr: 2 }} />
            Profile
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }} onClick={() => handleDropdownClose()}>
          <Box sx={{...styles, color: 'common.white', '& svg': { color: 'common.white' }}}>
            <EmailOutline sx={{ mr: 2 }} />
            Inbox
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }} onClick={() => handleDropdownClose()}>
          <Box sx={{...styles, color: 'common.white', '& svg': { color: 'common.white' }}}>
            <MessageOutline sx={{ mr: 2 }} />
            Chat
          </Box>
        </MenuItem>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        <MenuItem sx={{ p: 0, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }} onClick={() => handleDropdownClose()}>
          <Box sx={{...styles, color: 'common.white', '& svg': { color: 'common.white' }}}>
            <CogOutline sx={{ mr: 2 }} />
            Settings
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }} onClick={() => handleDropdownClose()}>
          <Box sx={{...styles, color: 'common.white', '& svg': { color: 'common.white' }}}>
            <CurrencyUsd sx={{ mr: 2 }} />
            Pricing
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }} onClick={() => handleDropdownClose()}>
          <Box sx={{...styles, color: 'common.white', '& svg': { color: 'common.white' }}}>
            <HelpCircleOutline sx={{ mr: 2 }} />
            FAQ
          </Box>
        </MenuItem>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        <MenuItem sx={{ py: 2, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }} onClick={handleLogout}>
          <LogoutVariant
            sx={{
              mr: 2,
              fontSize: '1.375rem',
              color: 'common.white'
            }}
          />
          <Typography sx={{ color: 'common.white' }}>Logout</Typography>
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
