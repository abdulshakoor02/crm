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

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from 'src/store'
import { getProductData } from 'src/store/apps/product'

const MUITableCell = styled(TableCell)<TableCellBaseProps>(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: `${theme.spacing(2)} !important`,
  fontSize: '0.95rem',
  fontWeight: 500
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
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
    : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  border: `1px solid ${theme.palette.divider}`,
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
  const [invoiceData, setInvoiceData] = useState<any>(null)
  const [product, setProduct] = useState<any>(null)

  const products = useSelector((state: any) => state.products)

  const { toPDF, targetRef } = usePDF({
    filename: `${invoiceData?.invoiceId || 'invoice'}.pdf`,
    page: { format: 'A4' }
  })

  useEffect(() => {
    dispatch(getProductData({}))

    // Clean up old invoice data (older than 24 hours)
    const cleanupOldInvoices = () => {
      const now = new Date().getTime()
      const oneDayAgo = now - (24 * 60 * 60 * 1000)

      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('invoice_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || '{}')
            const createdAt = new Date(data.createdAt).getTime()
            if (createdAt < oneDayAgo) {
              localStorage.removeItem(key)
            }
          } catch (error) {
            // Remove corrupted data
            localStorage.removeItem(key)
          }
        }
      })
    }

    cleanupOldInvoices()
  }, [dispatch])

  useEffect(() => {
    if (router.isReady && router.query.ref) {
      const urlRef = router.query.ref as string

      // Try to get invoice data from localStorage
      const storedData = localStorage.getItem(`invoice_${urlRef}`)

      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData)
          setInvoiceData(parsedData)
        } catch (error) {
          console.error('Error parsing invoice data:', error)
          // Redirect to leads page if data is corrupted
          router.push('/leads')
        }
      } else {
        // Redirect to leads page if no data found
        router.push('/leads')
      }
    }
  }, [router.isReady, router.query.ref, router])

  useEffect(() => {
    if (invoiceData?.productId && products?.rows) {
      const foundProduct = products.rows.find((p: any) => p.id === invoiceData.productId)
      setProduct(foundProduct)
    }
  }, [invoiceData, products])

  // Calculate pricing
  const basePrice = product?.price || 99.00
  const discountAmount = invoiceData?.discountType === 'percentage'
    ? (basePrice * (invoiceData.discount / 100))
    : (invoiceData?.discount || 0)
  const subtotal = basePrice - discountAmount
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax

  if (!invoiceData) {
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
        <InvoiceTitle variant="h3">
          {invoiceData?.invoiceId || 'Invoice'}
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
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
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
                  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#f8fafc',
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`
                }}>
                  <SectionTitle variant='h5' sx={{ color: theme.palette.text.primary, mb: 2 }}>
                    WeCRM Solutions
                  </SectionTitle>
                  <InfoText>Office 149, 450 South Brand Brooklyn</InfoText>
                  <InfoText>San Diego County, CA 91905, USA</InfoText>
                  <InfoText sx={{ fontWeight: 600, color: theme.palette.primary.main }}>+1 (123) 456 7891</InfoText>
                </Box>
                {invoiceData && (
                  <Box sx={{
                    p: 3,
                    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#f1f5f9',
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`
                  }}>
                    <SectionTitle sx={{ mb: 2 }}>Bill To:</SectionTitle>
                    <InfoText sx={{ fontWeight: 600, fontSize: '1rem', color: theme.palette.text.primary, mb: 1 }}>
                      {invoiceData.leadName}
                    </InfoText>
                    <InfoText sx={{ color: theme.palette.primary.main }}>{invoiceData.leadEmail}</InfoText>
                  </Box>
                )}
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
              <Box sx={{
                mb: 4,
                p: 3,
                backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2,
                color: 'white',
                minWidth: '280px',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
              }}>
                <Typography variant='h4' sx={{
                  mb: 3,
                  fontWeight: 700,
                  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif'
                }}>
                  {invoiceData?.invoiceId}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant='body2' sx={{ fontWeight: 600, opacity: 0.9 }}>
                      Date Issued:
                    </Typography>
                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                      {invoiceData?.createdAt ? new Date(invoiceData.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant='body2' sx={{ fontWeight: 600, opacity: 0.9 }}>
                      Due Date:
                    </Typography>
                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                      {invoiceData?.createdAt ?
                        new Date(new Date(invoiceData.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString() :
                        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: theme => `${theme.spacing(6)} !important` }} />

          <TableContainer sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            overflow: 'hidden'
          }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#f8fafc' }}>
                  <TableCell sx={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: theme.palette.text.primary,
                    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif'
                  }}>
                    Item
                  </TableCell>
                  <TableCell sx={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: theme.palette.text.primary,
                    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif'
                  }}>
                    Description
                  </TableCell>
                  <TableCell sx={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: theme.palette.text.primary,
                    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif'
                  }}>
                    Qty
                  </TableCell>
                  <TableCell sx={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: theme.palette.text.primary,
                    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif'
                  }}>
                    Price
                  </TableCell>
                  <TableCell sx={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: theme.palette.text.primary,
                    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif'
                  }}>
                    Total
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <MUITableCell>{product?.name || 'Premium Subscription'}</MUITableCell>
                  <MUITableCell>{product?.description || '12 months access'}</MUITableCell>
                  <MUITableCell>1</MUITableCell>
                  <MUITableCell>${basePrice.toFixed(2)}</MUITableCell>
                  <MUITableCell>${basePrice.toFixed(2)}</MUITableCell>
                </TableRow>
                {invoiceData?.discount > 0 && (
                  <TableRow>
                    <MUITableCell>Discount</MUITableCell>
                    <MUITableCell>
                      {invoiceData.discountType === 'percentage'
                        ? `${invoiceData.discount}% discount`
                        : 'Fixed discount'}
                    </MUITableCell>
                    <MUITableCell>1</MUITableCell>
                    <MUITableCell>-${discountAmount.toFixed(2)}</MUITableCell>
                    <MUITableCell>-${discountAmount.toFixed(2)}</MUITableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 'auto', position: 'relative', display: 'flex', justifyContent: 'flex-end' }}>
            <Box
              sx={{
                width: '350px',
                mt: 8,
                p: 3,
                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#f8fafc',
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.palette.mode === 'dark' ? '0 4px 16px rgba(0, 0, 0, 0.3)' : '0 4px 16px rgba(0, 0, 0, 0.08)'
              }}
            >
              <CalcWrapper>
                <Typography sx={{
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                }}>
                  Subtotal:
                </Typography>
                <Typography sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                }}>
                  ${subtotal.toFixed(2)}
                </Typography>
              </CalcWrapper>
              <CalcWrapper>
                <Typography sx={{
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                }}>
                  Tax (8%):
                </Typography>
                <Typography sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                }}>
                  ${tax.toFixed(2)}
                </Typography>
              </CalcWrapper>
              <Divider sx={{ my: 2, backgroundColor: theme.palette.divider }} />
              <CalcWrapper sx={{
                p: 2,
                backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 1,
                color: 'white'
              }}>
                <Typography variant='h6' sx={{
                  fontWeight: 700,
                  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif'
                }}>
                  Total:
                </Typography>
                <Typography variant='h5' sx={{
                  fontWeight: 700,
                  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif'
                }}>
                  ${total.toFixed(2)}
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
