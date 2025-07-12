// ** React Imports
import { useState, SyntheticEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Link from '@mui/material/Link'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'

import { useTheme } from '@mui/material/styles'

// ** Icons Imports
import ArrowRight from 'mdi-material-ui/ArrowRight'
import DotsVertical from 'mdi-material-ui/DotsVertical'

// ** Hooks Imports
import useBgColor from 'src/@core/hooks/useBgColor'

const CrmPlanUpgrade = () => {
  // ** States
  const [cvc1, setCvc1] = useState<number | string>('')
  const [cvc2, setCvc2] = useState<number | string>('')

  // ** Hook
  const theme = useTheme()
  const colorClasses = useBgColor()

  return (
    <Card sx={{ 
      background: theme => theme.palette.customColors.primaryGradient, 
      color: 'white',
      transition: 'transform 0.3s ease-in-out',
      '&:hover': {
        transform: 'scale(1.02)'
      }
    }}>
      <CardHeader
        title='Upgrade Your Plan'
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'common.white' }}>
            <DotsVertical />
          </IconButton>
        }
        titleTypographyProps={{
          sx: {
            color: 'common.white'
          }
        }}
      />
      <CardContent>
        <Typography variant='body2' sx={{ fontSize: '0.75rem', letterSpacing: '0.4px', color: 'common.white' }}>
          Please make the payment to start enjoying all the features of our premium plan as soon as possible.
        </Typography>

        <Box
          sx={{
            mt: 4,
            borderRadius: '4px',
            color: 'text.primary',
            p: theme => theme.spacing(2.25, 2.75),
            backgroundColor: colorClasses.primaryLight.backgroundColor
          }}
        >
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
            <Avatar
              variant='rounded'
              sx={{
                mr: 3,
                width: '2.625rem',
                height: '2.625rem',
                backgroundColor: 'transparent',
                border: theme => `1px solid ${theme.palette.common.white}`
              }}
            >
              <img width={23} height={20} alt='briefcase' src='/images/cards/briefcase.png' />
            </Avatar>

            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', color: 'common.white' }}>Platinum</Typography>
                <Link
                  href='/'
                  sx={{ fontWeight: 500, fontSize: '0.75rem', color: 'common.white' }}
                  onClick={(e: SyntheticEvent) => e.preventDefault()}
                >
                  Upgrade Plan
                </Link>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Typography
                  component='sup'
                  variant='caption'
                  sx={{ mt: 0.75, fontWeight: 500, color: 'common.white', alignSelf: 'flex-start' }}
                >
                  $
                </Typography>
                <Typography variant='h5' sx={{ fontWeight: 600, color: 'common.white' }}>
                  5,250
                </Typography>
                <Typography component='sub' variant='caption' sx={{ lineHeight: 1.5, alignSelf: 'flex-end', color: 'common.white' }}>
                  /Year
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Typography sx={{ mt: 4.5, mb: 2, fontWeight: 600, fontSize: '0.875rem', color: 'common.white' }}>Payment details</Typography>

        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <img width={42} height={30} alt='master-card' src='/images/cards/logo-mastercard-small.png' />
          <Box
            sx={{
              ml: 3,
              flexGrow: 1,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ mr: 2, display: 'flex', mb: 0.4, flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', color: 'common.white' }}>Credit card</Typography>
              <Typography variant='caption' sx={{ color: 'common.white' }}>2566 xxxx xxxx 8908</Typography>
            </Box>
            <TextField
              label='CVC'
              size='small'
              value={cvc1}
              type='number'
              sx={{ width: 80, mt: 0.4, input: { color: 'common.white' }, label: { color: 'common.white' } }}
              onChange={e =>
                e.target.value.length > 3
                  ? setCvc1(parseInt(e.target.value.slice(0, 3)))
                  : setCvc1(parseInt(e.target.value))
              }
            />
          </Box>
        </Box>

        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <img width={42} height={30} alt='credit-card' src='/images/cards/logo-credit-card-2.png' />
          <Box
            sx={{
              ml: 3,
              flexGrow: 1,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ mr: 2, display: 'flex', mb: 0.4, flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', color: 'common.white' }}>Credit card</Typography>
              <Typography variant='caption' sx={{ color: 'common.white' }}>8990 xxxx xxxx 6852</Typography>
            </Box>
            <TextField
              label='CVC'
              size='small'
              value={cvc2}
              type='number'
              sx={{ width: 80, mt: 0.4, input: { color: 'common.white' }, label: { color: 'common.white' } }}
              onChange={e =>
                e.target.value.length > 3
                  ? setCvc2(parseInt(e.target.value.slice(0, 3)))
                  : setCvc2(parseInt(e.target.value))
              }
            />
          </Box>
        </Box>

        <Link
          href='/'
          onClick={(e: SyntheticEvent) => e.preventDefault()}
          sx={{ mt: 4, fontWeight: 500, mb: 4, fontSize: '0.75rem', color: 'common.white' }}
        >
          Add Payment Method
        </Link>

        <FormControl fullWidth sx={{ mt: 4.5, mb: 3.5 }}>
          <TextField label='Email Address' placeholder='john.doe@email.com' size='small' sx={{ input: { color: 'common.white' }, label: { color: 'common.white' } }} />
        </FormControl>
        <Button fullWidth variant='contained' endIcon={<ArrowRight />} sx={{ background: theme.palette.common.white, color: theme.palette.primary.main, '&:hover': { background: theme.palette.grey[200] } }}>
          Proceed to payment
        </Button>
      </CardContent>
    </Card>
  )
}

export default CrmPlanUpgrade
