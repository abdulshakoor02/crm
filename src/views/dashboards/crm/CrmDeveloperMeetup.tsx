// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import StarOutline from 'mdi-material-ui/StarOutline'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import DotsHorizontal from 'mdi-material-ui/DotsHorizontal'
import MapMarkerOutline from 'mdi-material-ui/MapMarkerOutline'
import CheckCircleOutline from 'mdi-material-ui/CheckCircleOutline'
import ClockTimeThreeOutline from 'mdi-material-ui/ClockTimeThreeOutline'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

const CrmDeveloperMeetup = () => {
  return (
    <Card sx={{
      background: (theme) => theme.palette.customColors.primaryGradient,
      color: 'common.white',
      transition: 'transform 0.3s ease-in-out',
      '&:hover': {
        transform: 'scale(1.02)'
      }
    }}>
      <CardMedia sx={{ height: '11.25rem' }} image='/images/cards/workstation.png' />
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar
            skin='light'
            variant='rounded'
            sx={{
              mr: 3,
              width: '3rem',
              height: '3.375rem',
              backgroundColor: 'rgba(255,255,255,0.2)'
            }}
          >
            <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography
                variant='body2'
                sx={{ fontWeight: 500, lineHeight: 1.29, color: 'common.white', letterSpacing: '0.47px' }}
              >
                Jan
              </Typography>
              <Typography variant='h6' sx={{ mt: -0.75, fontWeight: 600, color: 'common.white' }}>
                24
              </Typography>
            </Box>
          </CustomAvatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 600, color: 'common.white' }}>Developer Meetup</Typography>
            <Typography variant='caption' sx={{ letterSpacing: '0.4px', color: 'common.white' }}>
              The WordPress open source, free software project is the community behind the…
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3, mt: 4.75, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'common.white' }}>
            <StarOutline sx={{ fontSize: '1.75rem' }} />
            <Typography sx={{ fontSize: '0.875rem' }}>Interested</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'common.white' }}>
            <CheckCircleOutline sx={{ fontSize: '1.75rem' }} />
            <Typography sx={{ fontSize: '0.875rem' }}>Joined</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'common.white' }}>
            <AccountOutline sx={{ fontSize: '1.75rem' }} />
            <Typography sx={{ fontSize: '0.875rem' }}>Invited</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'common.white' }}>
            <DotsHorizontal sx={{ fontSize: '1.75rem' }} />
            <Typography sx={{ fontSize: '0.875rem' }}>More</Typography>
          </Box>
        </Box>

        <Divider sx={{ mt: 2.75, mb: 3.25, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        <Box sx={{ mb: 2, display: 'flex', color: 'common.white' }}>
          <ClockTimeThreeOutline sx={{ mr: 3, mt: 1, fontSize: '1.375rem' }} />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontSize: '0.875rem' }}>Tuesday, 24 january, 10:20 - 12:30</Typography>
            <Typography variant='caption'>After 1 Week</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', color: 'common.white' }}>
          <MapMarkerOutline sx={{ mr: 3, mt: 1, fontSize: '1.375rem' }} />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontSize: '0.875rem' }}>The Rochard NYC</Typography>
            <Typography variant='caption'>1305 Lexington Ave, New York</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CrmDeveloperMeetup