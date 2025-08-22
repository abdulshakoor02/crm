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
import Skeleton from '@mui/material/Skeleton'
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
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: `${theme.spacing(1.5, 2)} !important`,
  fontSize: '0.875rem',
  color: theme.palette.text.primary
}))

const CalcWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 0),
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(0.5)
  }
}))

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[1],
  borderRadius: theme.spacing(1),
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden'
}))

const InvoiceTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.75rem',
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(0.5)
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1)
}))

const InfoText = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  lineHeight: 1.5,
  color: theme.palette.text.secondary
}))

const StatusBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(1),
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return { bg: '#e8f5e8', color: '#2e7d32' }
      case 'pending':
        return { bg: '#fff3e0', color: '#ef6c00' }
      case 'overdue':
        return { bg: '#ffebee', color: '#c62828' }
      default:
        return { bg: '#f5f5f5', color: '#424242' }
    }
  }

  const status = total - invoice?.data?.reciept?.amount_paid === 0 ? 'paid' : 'pending'

  if (invoice.loading) {
    return (
      <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="rectangular" width={140} height={40} />
        </Box>
        <Card sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" width={120} height={30} sx={{ mb: 2 }} />
              <Skeleton variant="text" width={200} height={20} />
              <Skeleton variant="text" width={150} height={20} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" width={120} height={30} sx={{ mb: 2 }} />
              <Skeleton variant="text" width={180} height={20} />
              <Skeleton variant="text" width={160} height={20} />
            </Grid>
          </Grid>
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ mt: 4 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Skeleton variant="rectangular" width={300} height={200} />
          </Box>
        </Card>
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <InvoiceTitle variant="h3">
            Invoice
          </InvoiceTitle>
          <Typography variant="body2" color="text.secondary">
            Receipt #{invoice?.data?.reciept?.reciept_no}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <StatusBadge sx={getStatusColor(status)}>
            {status}
          </StatusBadge>
          <Button
            variant="contained"
            onClick={() => toPDF()}
            startIcon={
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
              </svg>
            }
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.875rem',
              padding: '8px 16px',
              borderRadius: 1,
              textTransform: 'none'
            }}
          >
            Download PDF
          </Button>
        </Box>
      </Box>

      <StyledCard ref={targetRef as any}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          {/* Company and Customer Info */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <SectionTitle variant="h6">From</SectionTitle>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {invoice?.data?.reciept?.branch_name}
                </Typography>
                <InfoText>{invoice?.data?.reciept?.branch_address}</InfoText>
                <InfoText>{invoice?.data?.reciept?.branch_mobile}</InfoText>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                {img && (
                  <Box sx={{ mb: 2 }}>
                    <img width={120} height={90} src={img} alt="Company logo" style={{ objectFit: 'contain' }} />
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
              <SectionTitle variant="h6">Bill To</SectionTitle>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {invoice?.data?.reciept?.lead_name}
                </Typography>
                <InfoText>{invoice?.data?.reciept?.lead_email}</InfoText>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Invoice Date</Typography>
                <Typography variant="body2" color="text.secondary">
                  {invoice?.data?.reciept?.created_at ? new Date(invoice?.data?.reciept?.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Items Table */}
          <TableContainer sx={{ mb: 4 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Item</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', textAlign: 'center' }}>Qty</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', textAlign: 'right' }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', textAlign: 'right' }}>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoice?.data?.orders?.map((order: any) => (
                  <TableRow key={order.id}>
                    <MUITableCell>{order?.product_name}</MUITableCell>
                    <MUITableCell>{order?.product_desc}</MUITableCell>
                    <MUITableCell sx={{ textAlign: 'center' }}>{order?.quantity}</MUITableCell>
                    <MUITableCell sx={{ textAlign: 'right' }}>
                      {invoice?.data?.reciept?.currency} {order.product_price}
                    </MUITableCell>
                    <MUITableCell sx={{ textAlign: 'right' }}>
                      {invoice?.data?.reciept?.currency} {(order.quantity * order.product_price).toFixed(2)}
                    </MUITableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Totals */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ width: { xs: '100%', sm: '350px' } }}>
              <Card sx={{ p: 3 }}>
                <CalcWrapper>
                  <Typography sx={{ fontWeight: 500 }}>Subtotal:</Typography>
                  <Typography>
                    {invoice?.data?.reciept?.currency} {subtotal}
                  </Typography>
                </CalcWrapper>
                {discount > 0 && (
                  <CalcWrapper>
                    <Typography sx={{ fontWeight: 500 }}>Discount:</Typography>
                    <Typography>
                      {invoice?.data?.reciept?.currency} {discount}
                    </Typography>
                  </CalcWrapper>
                )}
                <CalcWrapper>
                  <Typography sx={{ fontWeight: 500 }}>Tax ({invoice?.data?.reciept?.tax}%):</Typography>
                  <Typography>
                    {invoice?.data?.reciept?.currency} {tax}
                  </Typography>
                </CalcWrapper>
                <Divider sx={{ my: 2 }} />
                <CalcWrapper>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Total:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {invoice?.data?.reciept?.currency} {total}
                  </Typography>
                </CalcWrapper>
                <CalcWrapper>
                  <Typography sx={{ fontWeight: 500 }}>Amount Paid:</Typography>
                  <Typography>
                    {invoice?.data?.reciept?.currency} {invoice?.data?.reciept?.amount_paid}
                  </Typography>
                </CalcWrapper>
                {invoice?.data?.reciept?.invoice_amount_paid > invoice?.data?.reciept?.amount_paid && (
                  <CalcWrapper>
                    <Typography sx={{ fontWeight: 500 }}>Total Amount Paid:</Typography>
                    <Typography>
                      {invoice?.data?.reciept?.currency} {invoice?.data?.reciept?.invoice_amount_paid}
                    </Typography>
                  </CalcWrapper>
                )}
                {total - invoice?.data?.reciept?.invoice_amount_paid !== 0 && (
                  <CalcWrapper>
                    <Typography sx={{ fontWeight: 600 }}>Pending Amount:</Typography>
                    <Typography sx={{ fontWeight: 600, color: 'error.main' }}>
                      {invoice?.data?.reciept?.currency} {(total - invoice?.data?.reciept?.invoice_amount_paid).toFixed(2)}
                    </Typography>
                  </CalcWrapper>
                )}
              </Card>
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="body2" color="text.secondary" align="center">
              Thank you for your business. For questions about this invoice, please contact {invoice?.data?.reciept?.branch_mobile}
            </Typography>
          </Box>
        </CardContent>
      </StyledCard>
    </Box>
  )
}

export default InvoicePage
