import React from 'react'
import { Box, Skeleton, Card } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[2],
  borderRadius: theme.spacing(1.5),
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden'
}))

const DataGridSkeleton = ({ rowCount = 5, columnCount = 6 }: { rowCount?: number, columnCount?: number }) => {
  return (
    <StyledCard>
      {/* Toolbar Skeleton */}
      <Box sx={{ p: 2, borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="rectangular" width={250} height={40} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
          </Box>
        </Box>
      </Box>

      {/* Table Header Skeleton */}
      <Box sx={{ px: 2, py: 1.5, borderBottom: (theme) => `1px solid ${theme.palette.divider}`, backgroundColor: 'grey.50' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {[...Array(columnCount)].map((_, index) => (
            <Skeleton key={index} variant="text" width={100 + Math.random() * 50} height={24} />
          ))}
        </Box>
      </Box>

      {/* Table Rows Skeleton */}
      <Box>
        {[...Array(rowCount)].map((_, rowIndex) => (
          <Box key={rowIndex} sx={{ display: 'flex', px: 2, py: 1.5, borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
            {[...Array(columnCount)].map((_, colIndex) => (
              <Box key={colIndex} sx={{ flex: 1 }}>
                <Skeleton 
                  variant="text" 
                  width={80 + Math.random() * 60} 
                  height={20} 
                  sx={{ 
                    opacity: 1 - (rowIndex * 0.1) 
                  }} 
                />
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      {/* Pagination Skeleton */}
      <Box sx={{ p: 2, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="rectangular" width={200} height={36} sx={{ borderRadius: 1 }} />
        </Box>
      </Box>
    </StyledCard>
  )
}

export default DataGridSkeleton