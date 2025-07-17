import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import { GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Magnify from 'mdi-material-ui/Magnify'
import Close from 'mdi-material-ui/Close'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import { Box } from '@mui/material'
import { ExportVariant } from 'mdi-material-ui'
import { useTheme } from '@mui/material/styles'

const StyledGridToolbarContainer = styled(GridToolbarContainer)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}))

interface ToolbarProps {
  searchValue: string
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSearch: () => void
  onClearSearch: () => void
  onAddRow?: () => void // Optional Add Row handler
  disableExport?: boolean // Option to disable export button
  add: boolean
}

const Toolbar: React.FC<ToolbarProps> = ({
  searchValue,
  onSearchChange,
  onSearch,
  onClearSearch,
  onAddRow,
  add,
  disableExport = false
}) => {
  const theme = useTheme()
  return (
    <StyledGridToolbarContainer>
      {/* Left Section: Export Button (Optional) */}
      {!disableExport && (
        <GridToolbarExport
          startIcon={<ExportVariant />}
          sx={{
            backgroundColor: 'transparent',
            color: 'primary.main',
            padding: '8px 16px',
            borderRadius: '4px',
            border: `1px solid ${theme.palette.primary.main}`,
            fontWeight: 500,
            fontSize: '0.875rem',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              borderColor: theme.palette.primary.dark,
            }
          }}
        />
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Search Field */}
        <TextField
          variant='outlined'
          size='small'
          value={searchValue}
          onChange={onSearchChange}
          placeholder='Search...'
          InputProps={{
            onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === 'Enter') {
                onSearch()
              }
            },
            startAdornment: <Magnify fontSize='small' sx={{ mr: 1, color: 'text.secondary' }} />,
            endAdornment: (
              <>
                {searchValue && (
                  <IconButton 
                    size='small' 
                    title='Clear' 
                    aria-label='Clear' 
                    onClick={onClearSearch}
                    sx={{ mr: 0.5 }}
                  >
                    <Close fontSize='small' />
                  </IconButton>
                )}
                <IconButton 
                  size='small' 
                  title='Search' 
                  aria-label='Search' 
                  onClick={onSearch}
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    }
                  }}
                >
                  <ArrowForwardIcon fontSize='small' />
                </IconButton>
              </>
            )
          }}
          sx={{
            width: {
              xs: 200,
              sm: 300
            },
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'background.paper',
            }
          }}
        />

        {/* Add Row Button */}
        {add && (
          <Button 
            variant='contained' 
            color='primary' 
            startIcon={<AddIcon />} 
            onClick={onAddRow}
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
            }}
          >
            Add Row
          </Button>
        )}
      </Box>
    </StyledGridToolbarContainer>
  )
}

export default Toolbar
