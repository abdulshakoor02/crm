'use client';
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import DialogTitle from '@mui/material/DialogTitle'
import CardContent from '@mui/material/CardContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'

import TransferList from 'src/components/TransferList'

const RolesCards = ({ role, features }: { role: any; features: any }) => {
  // ** States
  const [roleData, setRoleData] = useState<{ id: string; name: string }>({ id: '', name: '' })
  const [open, setOpen] = useState<boolean>(false)
  const [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit'>('Add')

  const handleClickOpen = (items: any) => {
    setRoleData({ name: items.name, id: items.id })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const renderCards = () =>
    role?.rows?.map((items: any) => (
      <Grid item xs={12} sm={6} lg={4} key={items.id}>
        <Card>
          <CardContent>
            <Box>
              <Typography variant='h6'>{items.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography
                variant='body2'
                sx={{ color: 'primary.main', cursor: 'pointer' }}
                onClick={() => {
                  handleClickOpen(items)
                  setDialogTitle('Edit')
                }}
              >
                Edit Role
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))

  return (
    <Grid container spacing={6} className='match-height'>
      {renderCards()}
      <Dialog fullWidth maxWidth='md' scroll='body' onClose={handleClose} open={open}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <Typography variant='h4' component='span'>
            {`${dialogTitle} Role`}
          </Typography>
          <Typography variant='body2'>Set Role Permissions</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 6, sm: 12 } }}>
          <Box sx={{ my: 4 }}>
            <TextField
              fullWidth
              value={roleData.name}
              label='RoleName'
              onChange={e => setRoleData({ name: e.target.value })}
              disabled={true}
              sx={{ mt: 4 }}
            />
          </Box>
          <Typography variant='h6'>Role Permissions</Typography>
          <TransferList features={features} role={roleData} modalClose={handleClose} />
        </DialogContent>
        <DialogActions sx={{ pt: 0, display: 'flex', justifyContent: 'center' }}>
          <Box className='demo-space-x'>
            <Button size='large' color='secondary' variant='outlined' onClick={handleClose}>
              Discard
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default RolesCards
