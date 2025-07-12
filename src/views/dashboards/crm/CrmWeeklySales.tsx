// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import TrendingUp from 'mdi-material-ui/TrendingUp'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import DotsVertical from 'mdi-material-ui/DotsVertical'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const CrmWeeklySales = () => {
  // ** Hook
  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    grid: {
      show: false,
      padding: {
        top: -15,
        left: -10,
        right: -10
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        distributed: true,
        columnWidth: '60%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    colors: [
      hexToRGBA(theme.palette.common.white, 0.1),
      hexToRGBA(theme.palette.common.white, 0.1),
      hexToRGBA(theme.palette.common.white, 0.1),
      hexToRGBA(theme.palette.common.white, 0.1),
      theme.palette.common.white,
      hexToRGBA(theme.palette.common.white, 0.1),
      hexToRGBA(theme.palette.common.white, 0.1)
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      categories: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      axisTicks: { show: false },
      axisBorder: { show: false },
      tickPlacement: 'on',
      labels: {
        style: {
          fontSize: '12px',
          colors: theme.palette.common.white
        }
      }
    },
    yaxis: { show: false }
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
        title='Weekly Sales'
        subheader='Total 85.4k Sales'
        titleTypographyProps={{ sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important', color: 'common.white' } }}
        subheaderTypographyProps={{ sx: { color: 'common.white' } }}
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'common.white' }}>
            <DotsVertical />
          </IconButton>
        }
      />
      <CardContent
        sx={{
          pt: `${theme.spacing(3)} !important`,
          '& .apexcharts-xaxis-label': { fill: `${theme.palette.common.white} !important` }
        }}
      >
        <ReactApexcharts type='bar' height={203} options={options} series={[{ data: [40, 60, 50, 60, 90, 40, 50] }]} />
        <Box sx={{ mt: 9.5, display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' sx={{ mr: 4, width: 42, height: 42, backgroundColor: 'rgba(255,255,255,0.2)' }} variant='rounded'>
              <TrendingUp sx={{ fontSize: '1.875rem', color: 'common.white' }} />
            </CustomAvatar>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600, color: 'common.white' }}>34.6k</Typography>
              <Typography variant='body2' sx={{ lineHeight: '1.313rem', letterSpacing: '0.25px', color: 'common.white' }}>
                Sales
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' sx={{ mr: 4, width: 42, height: 42, backgroundColor: 'rgba(255,255,255,0.2)' }} variant='rounded' color='success'>
              <CurrencyUsd sx={{ fontSize: '1.875rem', color: 'common.white' }} />
            </CustomAvatar>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600, color: 'common.white' }}>$482k</Typography>
              <Typography variant='body2' sx={{ lineHeight: '1.313rem', letterSpacing: '0.25px', color: 'common.white' }}>
                Total Profit
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CrmWeeklySales