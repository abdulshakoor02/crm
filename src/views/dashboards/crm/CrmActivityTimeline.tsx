// ** MUI Import
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

const CrmActivityTimeline = () => {
  return (
    <Card sx={{
      background: (theme) => theme.palette.customColors.primaryGradient,
      color: 'common.white',
      transition: 'transform 0.3s ease-in-out',
      '&:hover': {
        transform: 'scale(1.02)'
      }
    }}>
      <CardHeader
        title='Activity Timeline'
        titleTypographyProps={{ sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important', color: 'common.white' } }}
      />
      <CardContent>
        <Timeline sx={{ my: 0, py: 0 }}>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='error' />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ pr: 0, mt: 0, mb: theme => `${theme.spacing(1.5)} !important` }}>
              <Box
                sx={{
                  mb: 2.5,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography sx={{ mr: 2, fontWeight: 600, color: 'common.white' }}>
                  8 Invoices have been paid
                </Typography>
                <Typography variant='caption' sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Wednesday
                </Typography>
              </Box>
              <Typography variant='body2' sx={{ color: 'rgba(255,255,255,0.9)' }}>Invoices have been paid to the company.</Typography>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <img width={24} height={24} alt='invoice.pdf' src='/images/icons/file-icons/pdf.png' />
                <Typography variant='subtitle2' sx={{ ml: 2, fontWeight: 600, color: 'common.white' }}>
                  bookingCard.pdf
                </Typography>
              </Box>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='primary' />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ pr: 0, mt: 0, mb: theme => `${theme.spacing(1.5)} !important` }}>
              <Box
                sx={{
                  mb: 2.5,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography sx={{ mr: 2, fontWeight: 600, color: 'common.white' }}>
                  Create a new project for client 😎
                </Typography>
                <Typography variant='caption' sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  April, 18
                </Typography>
              </Box>
              <Typography variant='body2' sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
                Invoices have been paid to the company.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src='/images/avatars/1.png' sx={{ mr: 2.5, width: 24, height: 24 }} />
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'common.white' }}>John Doe (Client)</Typography>
              </Box>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='info' />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ pr: 0, mt: 0, mb: theme => `${theme.spacing(1.5)} !important` }}>
              <Box
                sx={{
                  mb: 2.5,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography sx={{ mr: 2, fontWeight: 600, color: 'common.white' }}>
                  Order #37745 from September
                </Typography>
                <Typography variant='caption' sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  January, 10
                </Typography>
              </Box>
              <Typography variant='body2' sx={{ color: 'rgba(255,255,255,0.9)' }}>Invoices have been paid to the company.</Typography>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem sx={{ minHeight: 0 }}>
            <TimelineSeparator>
              <TimelineDot color='warning' />
            </TimelineSeparator>
            <TimelineContent sx={{ pr: 0, mt: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography sx={{ mr: 2, fontWeight: 600, color: 'common.white' }}>Public Meeting</Typography>
                <Typography variant='caption' sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  September, 30
                </Typography>
              </Box>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </CardContent>
    </Card>
  )
}

export default CrmActivityTimeline
