import React, { useEffect, useState } from 'react'
import { Modal as MuiModal, Box, Typography, Button, IconButton } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: () => void
  mode: string
  title: React.ReactNode
  children: React.ReactNode
  className?: string
  width: number
  height?: string
}

const Modal = ({ isOpen, onClose, onSubmit, title, children, className, mode, width, height = '70vh' }: ModalProps) => {
  const [isRendered, setIsRendered] = useState(isOpen)
  const theme = useTheme()

  useEffect(() => {
    if (isOpen) setIsRendered(true)
  }, [isOpen])

  const handleClose = () => {
    setIsRendered(false)
    onClose()
  }

  if (!isRendered) return null

  return (
    <MuiModal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: theme => theme.palette.customColors.primaryGradient,
          borderRadius: 2,
          boxShadow: 24,
          p: { xs: 2, sm: 3, md: 4 },
          width: { xs: '95%', sm: '80%', md: width || 500 },
          maxHeight: { xs: '90vh', sm: '80vh', md: height || '70vh' },
          overflowY: 'auto',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'translate(-50%, -50%) scale(1.005)'
          }
        }}
        className={className} // You can still use the custom className if needed
      >
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
          <Typography variant='h6' sx={{ color: 'common.white' }}>{title}</Typography>
          <IconButton onClick={handleClose} sx={{ color: 'common.white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Modal Content */}
        <Box
          sx={{
            padding: 2, // Add padding
            minHeight: 200, // Set a minimum height
            overflowY: 'auto' // Allow vertical scrolling if content overflows
          }}
        >
          {children}
        </Box>

        {/* Modal Footer */}
        <Box display='flex' justifyContent='space-between' mt={3}>
          {(mode.toLowerCase() == 'edit' || mode.toLowerCase() == 'add') && (
            <Button variant='contained' onClick={onSubmit} sx={{ background: theme.palette.common.white, color: theme.palette.primary.main, '&:hover': { background: theme.palette.grey[200] } }}>
              Submit
            </Button>
          )}
          <Button variant='outlined' color='secondary' onClick={handleClose} sx={{ color: theme.palette.common.white, borderColor: theme.palette.common.white, '&:hover': { borderColor: theme.palette.grey[200], color: theme.palette.grey[200] } }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </MuiModal>
  )
}

export default Modal
