import React, { useEffect, useState } from 'react'
import { Modal as MuiModal, Box, Typography, Button, IconButton } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: () => void
  mode: string
  title: React.ReactNode
  children: React.ReactNode
  className?: string
}

const Modal = ({ isOpen, onClose, onSubmit, title, children, className, mode }: ModalProps) => {
  const [isRendered, setIsRendered] = useState(isOpen)

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
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          maxWidth: 500,
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
        className={className} // You can still use the custom className if needed
      >
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
          <Typography variant='h6'>{title}</Typography>
          <IconButton onClick={handleClose}>
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
          {mode == 'edit' || 'add' && (
            <Button variant='contained' onClick={onSubmit}>
              Submit
            </Button>
          )}
          <Button variant='outlined' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </MuiModal>
  )
}

export default Modal
