// ** MUI Imports
import React, { useEffect, useState } from 'react'
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
import { useRouter } from 'next/router'
import axios from 'src/store/axios'
import moment from 'moment';

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from 'src/store'
import { getProductData } from 'src/store/apps/product'
import { getSingleInvoiceData } from 'src/store/apps/invoice'
import { getTenantData } from 'src/store/apps/tenant'

const MUITableCell = styled(TableCell)<TableCellBaseProps>(({ theme }) => ({
  borderBottom: `1px solid rgba(255,255,255,0.2)`,
  padding: `${theme.spacing(2)} !important`,
  fontSize: '0.95rem',
  fontWeight: 500,
  color: 'common.white'
}))

const CalcWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 0),
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(1)
  }
}))

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.12)',
  borderRadius: theme.spacing(2),
  background: '#f8f8f8',
  border: `3px solid transparent`,
  backgroundClip: 'padding-box, border-box',
  backgroundOrigin: 'padding-box, border-box',
  backgroundImage: `linear-gradient(#f8f8f8, #f8f8f8), ${theme.palette.customColors.darkBorderGradient}`,
  overflow: 'hidden'
}))



const InvoiceTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  fontWeight: 700,
  fontSize: '2rem',
  background: 'linear-gradient(45deg, #667eea, #764ba2)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
  marginBottom: theme.spacing(1)
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  fontWeight: 600,
  fontSize: '1.1rem',
  color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
  marginBottom: theme.spacing(1)
}))

const InfoText = styled(Typography)(({ theme }) => ({
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: '0.9rem',
  lineHeight: 1.6,
  color: theme.palette.text.secondary
}))

const InvoicePage = () => {
  const theme = useTheme()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const invoice = useSelector((state: any) => state.invoice)
  const tenant = useSelector((state: any) => state.tenant)
  const [img, setImg] = useState('');
  const user = window.localStorage.getItem('userData');

  const { toPDF, targetRef } = usePDF({
    filename: `invoice.pdf`,
    page: { format: 'A4' }
  })

  useEffect(() => {
    if (router.isReady && router.query.reciept_id && router.query.invoice_id) {
      dispatch(getTenantData({
        where: [
          {
            column: '"tenants"."id"',
            operator: '=',
            value: JSON.parse(user).tenant_id
          }
        ]
      }))

      dispatch(getSingleInvoiceData({
        invoice_id: router.query.invoice_id,
        reciept_id: router.query.reciept_id
      }))

    }
  }, [router.isReady, router.query.ref, router])

  useEffect(() => {
    if (tenant?.rows?.length > 0) {
      axios.post(`${process.env.baseUrl}/fileDownload`, { url: tenant.rows[0].logo }, { responseType: 'blob' }).then((res) => {
        const url = URL.createObjectURL(res.data);
        setImg(url);
      })
    }
  }, [tenant])

  // Calculate pricing
  const subtotal = invoice?.data?.reciept?.total;
  const discount = invoice?.data?.reciept?.discount;
  const tax = (subtotal - discount) * invoice?.data?.reciept?.tax / 100 // 8% tax
  const total = (subtotal - discount) + tax

  if (invoice.loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <Box sx={{
          width: 60,
          height: 60,
          border: `4px solid ${theme.palette.divider}`,
          borderTop: `4px solid ${theme.palette.primary.main}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' }
          }
        }} />
        <Typography variant="h6" sx={{
          color: theme.palette.text.secondary,
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
        }}>
          Loading invoice...
        </Typography>
      </Box>
    )
  }

  return (
    <>
      {/* Header with Invoice Title and Download Button */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <InvoiceTitle variant="h3" sx={{ background: theme => theme.palette.customColors.primaryGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {'Invoice'}
        </InvoiceTitle>
        <Button
          variant='contained'
          onClick={() => toPDF()}
          startIcon={
            <svg width='20' height='20' viewBox='0 0 24 24'>
              <path fill='currentColor' d='M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z' />
            </svg>
          }
          sx={{
            background: theme => theme.palette.customColors.primaryGradient,
            color: 'white',
            fontWeight: 600,
            fontSize: '0.95rem',
            padding: '12px 24px',
            borderRadius: '12px',
          }}
        >
          Download PDF
        </Button>
      </Box>
      <StyledCard ref={targetRef as any} sx={{ position: 'relative', minHeight: '95vh' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} sx={{ mb: { sm: 0, xs: 4 } }}>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{
                  mb: 6,
                  p: 3,
                  background: theme.palette.customColors.primaryGradient,
                  borderRadius: 2,
                  border: `3px solid transparent`,
                  backgroundClip: 'padding-box, border-box',
                  backgroundOrigin: 'padding-box, border-box',
                  backgroundImage: `linear-gradient(${theme.palette.customColors.primaryGradient}), ${theme.palette.customColors.darkBorderGradient}`,
                }}>
                  <SectionTitle variant='h5' sx={{ color: 'common.white', mb: 2 }}>
                    {invoice?.data?.reciept?.branch_name}
                  </SectionTitle>
                  <InfoText sx={{ color: 'common.white' }}>{invoice?.data?.reciept?.branch_address}</InfoText>
                  <InfoText sx={{ fontWeight: 600, color: 'common.white' }}>{invoice?.data?.reciept?.branch_mobile}</InfoText>
                </Box>
                {invoice && (
                  <Box sx={{
                    p: 3,
                    background: theme.palette.customColors.primaryGradient,
                    borderRadius: 2,
                    border: `3px solid transparent`,
                    backgroundClip: 'padding-box, border-box',
                    backgroundOrigin: 'padding-box, border-box',
                    backgroundImage: `linear-gradient(${theme.palette.customColors.primaryGradient}), ${theme.palette.customColors.darkBorderGradient}`,
                  }}>
                    <SectionTitle sx={{ mb: 2, color: 'common.white' }}>Bill To:</SectionTitle>
                    <InfoText sx={{ fontWeight: 600, fontSize: '1rem', color: 'common.white', mb: 1 }}>
                      {invoice?.data?.reciept?.lead_name}
                    </InfoText>
                    <InfoText sx={{ color: 'common.white' }}>{invoice?.data?.reciept?.lead_email}</InfoText>
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <img width={200} height={150} src={img} alt="Base64 image" />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: { xs: 'left', sm: 'flex-end' } }}>
              <Box sx={{
                mb: 4,
                p: 3,

                background: theme.palette.customColors.primaryGradient,
                borderRadius: 2,
                color: 'white',
                minWidth: '280px',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                border: `3px solid transparent`,
                backgroundClip: 'padding-box, border-box',
                backgroundOrigin: 'padding-box, border-box',
                backgroundImage: `linear-gradient(135deg,${theme.palette.customColors.primaryGradient}) 0%, ${theme.palette.customColors.darkBorderGradient} 100%`,
              }}>
                <Typography variant='h4' sx={{
                  mb: 3,
                  fontWeight: 700,
                  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                  color: 'common.white'
                }}>
                  Reciept No: {invoice?.data?.reciept?.reciept_no}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant='body2' sx={{ fontWeight: 600, opacity: 0.9, color: 'common.white' }}>
                      Date Issued:
                    </Typography>
                    <Typography variant='body2' sx={{ fontWeight: 500, color: 'common.white' }}>
                      {invoice?.data?.reciept?.created_at ? new Date(invoice?.data?.reciept?.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: theme => `${theme.spacing(6)} !important` }} />

          <TableContainer sx={{
            background: theme.palette.customColors.primaryGradient,
            borderRadius: 2,
            border: `3px solid transparent`,
            backgroundClip: 'padding-box, border-box',
            backgroundOrigin: 'padding-box, border-box',
            backgroundImage: `linear-gradient(${theme.palette.customColors.primaryGradient}), ${theme.palette.customColors.darkBorderGradient}`,
            overflow: 'hidden'
          }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <TableCell sx={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'common.white',
                    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif'
                  }}>
                    Item
                  </TableCell>
                  <TableCell sx={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'common.white',
                    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif'
                  }}>
                    Description
                  </TableCell>
                  <TableCell sx={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'common.white',
                    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif'
                  }}>
                    Qty
                  </TableCell>
                  <TableCell sx={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'common.white',
                    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif'
                  }}>
                    Price
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  invoice?.data?.orders?.map((order: any) => (
                    <TableRow key={order.id}>
                      <MUITableCell>{order?.product_name}</MUITableCell>
                      <MUITableCell>{order?.product_desc}</MUITableCell>
                      <MUITableCell>{order?.quantity}</MUITableCell>
                      <MUITableCell>{invoice?.data?.reciept?.currency} {order.product_price}</MUITableCell>
                    </TableRow>
                  ))

                }
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 'auto', position: 'relative', display: 'flex', justifyContent: 'flex-end' }}>
            <Box
              sx={{
                width: '350px',
                mt: 8,
                p: 3,
                background: theme.palette.customColors.primaryGradient,
                borderRadius: 2,
                border: `3px solid transparent`,
                backgroundClip: 'padding-box, border-box',
                backgroundOrigin: 'padding-box, border-box',
                backgroundImage: `linear-gradient(${theme.palette.customColors.primaryGradient}), ${theme.palette.customColors.darkBorderGradient}`,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
              }}
            >
              <CalcWrapper>
                <Typography sx={{
                  fontWeight: 600,
                  color: 'common.white',
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                }}>
                  Subtotal:
                </Typography>
                <Typography sx={{
                  fontWeight: 600,
                  color: 'common.white',
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                }}>
                  {invoice?.data?.reciept?.currency} {subtotal}
                </Typography>
              </CalcWrapper>
              <CalcWrapper>
                <Typography sx={{
                  fontWeight: 600,
                  color: 'common.white',
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                }}>
                  Discount:
                </Typography>
                <Typography sx={{
                  fontWeight: 600,
                  color: 'common.white',
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                }}>
                  {invoice?.data?.reciept?.currency} {discount}
                </Typography>
              </CalcWrapper>
              <CalcWrapper>
                <Typography sx={{
                  fontWeight: 600,
                  color: 'common.white',
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                }}>
                  Tax ({invoice?.data?.reciept?.tax}%):
                </Typography>
                <Typography sx={{
                  fontWeight: 600,
                  color: 'common.white',
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                }}>
                  {invoice?.data?.reciept?.currency} {tax}
                </Typography>
              </CalcWrapper>
              <Divider sx={{ my: 2, backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <CalcWrapper sx={{
                p: 2,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 1,
                color: 'white'
              }}>
                <Typography variant='h6' sx={{
                  fontWeight: 700,
                  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                  color: 'common.white'
                }}>
                  Total:
                </Typography>
                <Typography variant='h5' sx={{
                  fontWeight: 700,
                  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                  color: 'common.white'
                }}>
                  {invoice?.data?.reciept?.currency} {total}
                </Typography>
              </CalcWrapper>
              <CalcWrapper sx={{
                p: 2,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 1,
                color: 'white'
              }}>
                <Typography variant='h6' sx={{
                  fontWeight: 700,
                  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                  color: 'common.white'
                }}>
                  Amount Paid:
                </Typography>
                <Typography variant='h5' sx={{
                  fontWeight: 700,
                  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                  color: 'common.white'
                }}>
                  {invoice?.data?.reciept?.currency} {invoice?.data?.reciept?.amount_paid}
                </Typography>
              </CalcWrapper>
              <CalcWrapper sx={{
                p: 2,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 1,
                color: 'white'
              }}>
                <Typography variant='h6' sx={{
                  fontWeight: 700,
                  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                  color: 'common.white'
                }}>
                  Pending Amount:
                </Typography>
                <Typography variant='h5' sx={{
                  fontWeight: 700,
                  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                  color: 'common.white'
                }}>
                  {invoice?.data?.reciept?.currency} {total - invoice?.data?.reciept?.amount_paid}
                </Typography>
              </CalcWrapper>
            </Box>
          </Box>
        </CardContent>
      </StyledCard>
    </>
  )
}

export default InvoicePage
