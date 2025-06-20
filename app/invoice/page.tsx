'use client';
// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import TableContainer from '@mui/material/TableContainer'
import TableCell, { TableCellBaseProps } from '@mui/material/TableCell'

const MUITableCell = styled(TableCell)<TableCellBaseProps>(({ theme }) => ({
  borderBottom: 0,
  padding: `${theme.spacing(1)} !important`
}))

const CalcWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

export default function StaticInvoicePage() { // Renamed component
  const theme = useTheme() // theme is used by styled components implicitly and can be used explicitly if needed

  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: { sm: 0, xs: 4 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 6 }}>
                <Typography variant='h5'>Company Name</Typography>
                <Typography variant='body2'>Office 149, 450 South Brand Brooklyn</Typography>
                <Typography variant='body2'>San Diego County, CA 91905, USA</Typography>
                <Typography variant='body2'>+1 (123) 456 7891</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: { xs: 'left', sm: 'flex-end' } }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant='h5' sx={{ mb: 2 }}>Invoice #3492</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='body2'>Date Issued: 25/05/2022</Typography>
                <Typography variant='body2'>Due Date: 29/05/2022</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: theme => `${theme.spacing(6)} !important` }} />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <MUITableCell>Premium Subscription</MUITableCell>
                <MUITableCell>12 months access</MUITableCell>
                <MUITableCell>1</MUITableCell>
                <MUITableCell>$99.00</MUITableCell>
                <MUITableCell>$99.00</MUITableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ width: '300px', mt: 8 }}>
            <CalcWrapper>
              <Typography>Subtotal:</Typography>
              <Typography>$99.00</Typography>
            </CalcWrapper>
            <CalcWrapper>
              <Typography>Tax:</Typography>
              <Typography>$8.00</Typography>
            </CalcWrapper>
            <Divider sx={{ my: 2 }} />
            <CalcWrapper>
              <Typography>Total:</Typography>
              <Typography variant='h6'>$107.00</Typography>
            </CalcWrapper>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
