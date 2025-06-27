import React, { useEffect, useState } from 'react'
import { Modal as MuiModal, Box, Typography, Button, IconButton } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: () => void // This onSubmit might become a post-form-submission callback or be removed
  mode: string
  title: React.ReactNode
  children: React.ReactNode
  className?: string
  width: number
  height?: string
  formId?: string // New prop for associating with a form
}

const Modal = ({
  isOpen,
  onClose,
  onSubmit, // Keep for now, might be repurposed or removed depending on usage in LeadsPage
  title,
  children,
  className,
  mode,
  width,
  height = '70vh',
  formId // Destructure new prop
}: ModalProps) => {
  const [isRendered, setIsRendered] = useState(isOpen)

  useEffect(() => {
    if (isOpen) setIsRendered(true)
    // No specific animation on close, so just rely on isOpen to unmount via parent
  }, [isOpen])

  // Corrected: Let parent control unmount via isOpen to avoid issues with animations or state
  // if (!isOpen && !isRendered) return null; // If you want to keep it rendered for exit animations
  // For simplicity, if !isOpen, we don't render anything from the modal's perspective here.
  // The parent controls the <Model /> instance.
  // The isRendered state was mostly for complex animations; not strictly needed for basic open/close.
  // Let's simplify: if (!isOpen) return null;

  if (!isOpen) return null; // Only render if isOpen is true


  return (
    <MuiModal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: { xs: 2, sm: 3, md: 4 },
          width: { xs: '95%', sm: '80%', md: width || 500 },
          maxHeight: { xs: '90vh', sm: '80vh', md: height || '70vh' },
          overflowY: 'auto',
          display: 'flex', // Added for flex column layout
          flexDirection: 'column' // Added for flex column layout
        }}
        className={className}
      >
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={2} sx={{ flexShrink: 0 }}> {/* Header */}
          <Typography variant='h6'>{title}</Typography>
          <IconButton onClick={onClose}> {/* Changed from handleClose to direct onClose */}
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Modal Content */}
        <Box
          sx={{
            // padding: 2, // Padding can be handled by child or here
            flexGrow: 1, // Allow content to take available space
            minHeight: 100, // Adjusted min height, can be removed if children define it
            overflowY: 'auto'
          }}
        >
          {children}
        </Box>

        {/* Modal Footer */}
        <Box display='flex' justifyContent='space-between' mt={3} sx={{ flexShrink: 0 }}> {/* Footer */}
          {(mode.toLowerCase() === 'edit' || mode.toLowerCase() === 'add') && (
            <Button
              variant='contained'
              type="submit" // Changed to type="submit"
              form={formId} // Associate with the form using formId
              // onClick={onSubmit} // Removed: form submission is now standard HTML
            >
              Submit
            </Button>
          )}
          <Button variant='outlined' color='secondary' onClick={onClose}> {/* Changed from handleClose to direct onClose */}
            Cancel
          </Button>
        </Box>
      </Box>
    </MuiModal>
  )
}

export default Modal
