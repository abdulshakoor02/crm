// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'

// ** Icons Imports
import DotsVertical from 'mdi-material-ui/DotsVertical'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Types Imports
import { CardStatsVerticalProps } from 'src/@core/components/card-statistics/types'

const CardStatsVertical = (props: CardStatsVerticalProps) => {
  // ** Props
  const { title, subtitle, color, icon, stats, trend, trendNumber } = props

  // ** Hook
  const theme = useTheme()

  return (
    <Card sx={{
      background: theme.palette.customColors.primaryGradient,
      color: 'common.white',
      transition: 'transform 0.3s ease-in-out',
      '&:hover': {
        transform: 'scale(1.02)'
      }
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', mb: 5.5, alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <CustomAvatar color={color} sx={{ boxShadow: 3, mr: 4, backgroundColor: 'rgba(255,255,255,0.2)' }}>
            {icon}
          </CustomAvatar>
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'common.white' }}>
            <DotsVertical />
          </IconButton>
        </Box>
        <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'common.white' }}>{title}</Typography>
        <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', mb: 1.5, alignItems: 'flex-start' }}>
          <Typography variant='h6' sx={{ mr: 2, color: 'common.white' }}>
            {stats}
          </Typography>
          <Typography
            component='sup'
            variant='caption'
            sx={{ color: trend === 'positive' ? 'success.main' : 'error.main' }}
          >
            {trendNumber}
          </Typography>
        </Box>
        <Typography variant='caption' sx={{ color: 'common.white' }}>{subtitle}</Typography>
      </CardContent>
    </Card>
  )
}

export default CardStatsVertical

CardStatsVertical.defaultProps = {
  color: 'primary',
  trend: 'positive'
}