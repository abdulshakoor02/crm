// ** MUI Imports
import React, { useRef } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import TableContainer from '@mui/material/TableContainer'
import TableCell, { TableCellBaseProps } from '@mui/material/TableCell'
import { usePDF } from 'react-to-pdf'

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

const InvoicePage = () => {
  const theme = useTheme()
  const { toPDF, targetRef } = usePDF({
    filename: 'invoice.pdf',
    page: { format: 'A4' }
  })

  // const targetRef = useRef<any>();
  //
  // const handleGeneratePdf = () => {
  //   generatePDF(targetRef, {
  //     filename: 'invoice.pdf',
  //     page: { format: 'A4' }
  //   });
  // };

  return (
    <>
      <Box sx={{ mb: 4, textAlign: 'right' }}>
        <Button
          variant='contained'
          onClick={() => toPDF()}
          startIcon={
            <svg width='20' height='20' viewBox='0 0 24 24'>
              <path fill='currentColor' d='M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z' />
            </svg>
          }
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark
            }
          }}
        >
          Download PDF
        </Button>
      </Box>
      <Card ref={targetRef as any} sx={{ position: 'relative', height: '95%' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} sx={{ mb: { sm: 0, xs: 4 } }}>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 6 }}>
                  <Typography variant='h5'>Company Name</Typography>
                  <Typography variant='body2'>Office 149, 450 South Brand Brooklyn</Typography>
                  <Typography variant='body2'>San Diego County, CA 91905, USA</Typography>
                  <Typography variant='body2'>+1 (123) 456 7891</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <svg
                  width={80}
                  height={65}
                  version='1.1'
                  viewBox='0 0 30 23'
                  xmlns='http://www.w3.org/2000/svg'
                  xmlnsXlink='http://www.w3.org/1999/xlink'
                >
                  <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                    <g id='Artboard' transform='translate(-95.000000, -51.000000)'>
                      <g id='logo' transform='translate(95.000000, 50.000000)'>
                        <path
                          id='Combined-Shape'
                          fill={theme.palette.primary.main}
                          d='M30,21.3918362 C30,21.7535219 29.9019196,22.1084381 29.7162004,22.4188007 C29.1490236,23.366632 27.9208668,23.6752135 26.9730355,23.1080366 L26.9730355,23.1080366 L23.714971,21.1584295 C23.1114106,20.7972624 22.7419355,20.1455972 22.7419355,19.4422291 L22.7419355,19.4422291 L22.741,12.7425689 L15,17.1774194 L7.258,12.7425689 L7.25806452,19.4422291 C7.25806452,20.1455972 6.88858935,20.7972624 6.28502902,21.1584295 L3.0269645,23.1080366 C2.07913318,23.6752135 0.850976404,23.366632 0.283799571,22.4188007 C0.0980803893,22.1084381 2.0190442e-15,21.7535219 0,21.3918362 L0,3.58469444 L0.00548573643,3.43543209 L0.00548573643,3.43543209 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 L15,9.19354839 L26.9548759,1.86636639 C27.2693965,1.67359571 27.6311047,1.5715689 28,1.5715689 C29.1045695,1.5715689 30,2.4669994 30,3.5715689 L30,3.5715689 Z'
                        />
                      </g>
                    </g>
                  </g>
                </svg>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: { xs: 'left', sm: 'flex-end' } }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant='h5' sx={{ mb: 2 }}>
                  Invoice #3492
                </Typography>
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

          <Box sx={{ mt: 'auto', position: 'relative', display: 'flex', justifyContent: 'flex-end' }}>
            <Box
              sx={{
                width: '300px',
                mt: 8
              }}
            >
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
    </>
  )
}

export default InvoicePage
