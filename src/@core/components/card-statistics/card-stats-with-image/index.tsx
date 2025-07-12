// ** React Imports
import { ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Types
import { CardStatsCharacterProps } from './types'

const CardStatisticsCharacter = (props: CardStatsCharacterProps) => {
  // ** Props
  const { title, src, stats, chipText, chipColor, trendNumber, trend } = props

  // ** Hook
  const theme = useTheme()

  return (
    <Card sx={{
      overflow: 'hidden',
      position: 'relative',
      background: theme.palette.customColors.primaryGradient,
      color: 'common.white',
      transition: 'transform 0.3s ease-in-out',
      '&:hover': {
        transform: 'scale(1.02)'
      }
    }}>
      <CardContent sx={{ p: theme => `${theme.spacing(6.75, 5, 6.25)} !important` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ mb: 1.5, fontWeight: 600, whiteSpace: 'nowrap', color: 'common.white' }}>
              {title}
            </Typography>
            <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
              <Typography variant='h5' sx={{ fontWeight: 600, whiteSpace: 'nowrap', color: 'common.white' }}>
                {stats}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'common.white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    variant='caption'
                    sx={{
                      fontWeight: 600,
                      lineHeight: 1.5,
                      color: trend === 'negative' ? 'error.main' : 'success.main'
                    }}
                  >
                    {trendNumber}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CustomChip
              skin='light'
              size='small'
              label={chipText}
              color={chipColor}
              sx={{
                height: 20,
                fontWeight: 600,
                fontSize: '0.75rem',
                '& .MuiChip-label': { px: 2.5 }
              }}
            />
          </Box>
          <Box sx={{ lineHeight: 1 }}>
            <img src={src} alt={title} width={130} height={130} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CardStatisticsCharacter
