// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import Circle from 'mdi-material-ui/Circle'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import DotsVertical from 'mdi-material-ui/DotsVertical'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const CrmSalesOverview = () => {
  // ** Hook
  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      sparkline: { enabled: true }
    },
    colors: [
      theme.palette.common.white,
      hexToRGBA(theme.palette.common.white, 0.7),
      hexToRGBA(theme.palette.common.white, 0.5),
      theme.palette.customColors.primaryGradient
    ],
    stroke: { width: 0 },
    legend: { show: false },
    dataLabels: { enabled: false },
    labels: ['Apparel', 'Electronics', 'FMCG', 'Other Sales'],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    plotOptions: {
      pie: {
        customScale: 0.9,
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              offsetY: 25,
              color: theme.palette.common.white
            },
            value: {
              offsetY: -15,
              formatter: value => `${value}k`,
              color: theme.palette.common.white
            },
            total: {
              show: true,
              label: 'Weekly Sales',
              formatter: value => `${value.globals.seriesTotals.reduce((total: number, num: number) => total + num)}k`,
              color: theme.palette.common.white
            }
          }
        }
      }
    }
  }

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
        title='Sales Overview'
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important', color: 'common.white' }
        }}
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'common.white' }}>
            <DotsVertical />
          </IconButton>
        }
      />
      <CardContent
        sx={{
          '& .apexcharts-datalabel-label': {
            lineHeight: '1.313rem',
            letterSpacing: '0.25px',
            fontSize: '0.875rem !important',
            fill: `${theme.palette.common.white} !important`
          },
          '& .apexcharts-datalabel-value': {
            letterSpacing: 0,
            lineHeight: '2rem',
            fontWeight: '500 !important',
            fill: `${theme.palette.common.white} !important`
          }
        }}
      >
        <Grid container sx={{ my: [0, 4, 1.625] }}>
          <Grid item xs={12} sm={6} sx={{ mb: [3, 0] }}>
            <ReactApexcharts type='donut' height={220} series={[12, 25, 13, 50]} options={options} />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ my: 'auto' }}>
            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' sx={{ mr: 3, backgroundColor: 'rgba(255,255,255,0.2)' }} variant='rounded'>
                <CurrencyUsd sx={{ color: 'common.white' }} />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='body2' sx={{ color: 'common.white' }}>Number of Sales</Typography>
                <Typography variant='h6' sx={{ color: 'common.white' }}>$86,400</Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
            <Grid container>
              <Grid item xs={6} sx={{ mb: 4 }}>
                <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
                  <Circle sx={{ mr: 1.5, fontSize: '0.75rem', color: 'common.white' }} />
                  <Typography variant='body2' sx={{ color: 'common.white' }}>Apparel</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600, color: 'common.white' }}>$12,150</Typography>
              </Grid>
              <Grid item xs={6} sx={{ mb: 4 }}>
                <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
                  <Circle sx={{ mr: 1.5, fontSize: '0.75rem', color: hexToRGBA(theme.palette.common.white, 0.7) }} />
                  <Typography variant='body2' sx={{ color: 'common.white' }}>Electronic</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600, color: 'common.white' }}>$24,900</Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
                  <Circle sx={{ mr: 1.5, fontSize: '0.75rem', color: hexToRGBA(theme.palette.common.white, 0.5) }} />
                  <Typography variant='body2' sx={{ color: 'common.white' }}>FMCG</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600, color: 'common.white' }}>$12,750</Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
                  <Circle sx={{ mr: 1.5, fontSize: '0.75rem', color: theme.palette.customColors.primaryGradient }} />
                  <Typography variant='body2' sx={{ color: 'common.white' }}>Other Sales</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600, color: 'common.white' }}>$50,200</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CrmSalesOverview