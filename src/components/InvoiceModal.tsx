import {
  Box,
  Grid,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import Modal from 'src/components/Model/Model'

const InvoiceModal = ({
  invoiceModalOpen,
  handleCloseInvoiceModal,
  handleInvoiceSubmit,
  selectedLead,
  setSelectedLead,
  invoiceData,
  setInvoiceData,
  invoiceErrors,
  product,
  branch,
  totalWithVat,
  setTotalWithVat
}: any) => {

  const selectedBranch = branch?.rows?.find((p: any) => p.id === selectedLead?.branch_id)

  return (
    <Modal
      width={520}
      isOpen={invoiceModalOpen}
      onClose={handleCloseInvoiceModal}
      title="🧾 Generate Invoice"
      onSubmit={handleInvoiceSubmit}
      mode="Add"
      height="auto"
    >
      <Grid container spacing={2}>

        {selectedLead && (
          <>
            {/* Lead Info Card */}
            <Grid item xs={12}>
              <Box sx={{
                p: 2,
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(25, 118, 210, 0.04)',
                borderRadius: 1.5,
                border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.2)' : 'rgba(25, 118, 210, 0.12)'}`
              }}>
                <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 1, fontWeight: 600 }}>
                  Lead Information
                </Typography>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Typography variant="body2"><strong>Name:</strong> {selectedLead.name}</Typography>
                  <Typography variant="body2"><strong>Email:</strong> {selectedLead.email}</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Product Info & Add Button */}
            <Grid item xs={12}>
              <Box sx={{
                p: 2,
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(25, 118, 210, 0.04)',
                borderRadius: 1.5,
                border: (theme) => theme.palette.mode === 'dark' ? '1px solid rgba(144, 202, 249, 0.2)' : '1px solid rgba(25, 118, 210, 0.12)}'
              }}>
                <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 1, fontWeight: 600 }}>
                  Select Products
                </Typography>
                <TextField
                  fullWidth
                  select
                  multiple // Added multiple prop
                  name='product_ids' // Changed name to product_ids
                  value={selectedLead?.product_ids || []} // Ensure value is an array, access from selectedLead
                  label='Products' // Changed label to Products
                  // error={!!errors.product_ids} // Accessing errors might be complex here, consider if needed
                  // helperText={errors.product_ids}
                  onChange={e => {
                    const selectedValues = e.target.value as unknown as string[]
                    setSelectedLead({ ...selectedLead, product_ids: selectedValues })

                    const prods = new Map();
                    for (const p of product?.rows) {
                      prods.set(p.id, p.price);
                    }
                    let total = 0;
                    for (const val of selectedValues) {
                      total += prods.get(val);
                    }
                    const tax = 1 + selectedBranch.tax / 100
                    setTotalWithVat(total * tax)
                  }}
                  sx={{ mt: 2 }} // Adjusted margin
                  SelectProps={{
                    multiple: true,
                    renderValue: (selected) => (product?.rows?.filter((p: any) => (selected as string[]).includes(p.id)).map((p: any) => p.name).join(', ') || '') as React.ReactNode,
                  }}
                >
                  {product?.rows?.map((items: any) => (
                    <MenuItem key={items.id} value={items.id}>
                      {items.name} ({selectedBranch.country.currency} {items.price?.toFixed(2)})
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Grid>

            {/* Product Info Display - This will be updated in a later step to show multiple products */}
            {selectedLead?.product_ids && selectedLead.product_ids.length > 0 && (
              <Grid item xs={12}>
                <Box sx={{
                  p: 2,
                  mt: 2,
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(25, 118, 210, 0.04)',
                  borderRadius: 1.5,
                  border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.2)' : 'rgba(25, 118, 210, 0.12)'}`
                }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 1, fontWeight: 600 }}>
                    Selected Product Details
                  </Typography>
                  {selectedLead.product_ids.map((productId: string) => {
                    const selectedProduct = product?.rows?.find((p: any) => p.id === productId)
                    if (!selectedProduct) return null

                    return (
                      <Box key={productId} sx={{ mb: 1, pb: 1, borderBottom: '1px dashed rgba(0,0,0,0.1)' }}>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Product:</strong> {selectedProduct.name}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Description:</strong> {selectedProduct.desc}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Price:</strong> {selectedBranch.country.currency} {selectedProduct.price?.toFixed(2)}
                        </Typography>
                      </Box>
                    )
                  })}
                </Box>
              </Grid>
            )}
          </>
        )}

        {/* Discount Section */}
        <Grid item xs={12}>
          <Box sx={{
            p: 2,
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(25, 118, 210, 0.04)',
            borderRadius: 1.5,
            border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.2)' : 'rgba(25, 118, 210, 0.12)'}`
          }}>
            <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 1.5, fontWeight: 600 }}>
              Discount Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="Discount"
                  type="number"
                  value={invoiceData.discount}
                  onChange={e => {
                    const prods = new Map();
                    for (const p of product?.rows) {
                      prods.set(p.id, p.price);
                    }
                    let total = 0;
                    for (const val of selectedLead?.product_ids) {
                      total += prods.get(val);
                    }
                    total = total - Number(e.target.value);
                    const tax = 1 + selectedBranch.tax / 100
                    setTotalWithVat(total * tax)
                    setInvoiceData({ ...invoiceData, discount: e.target.value })
                  }}
                  error={!!invoiceErrors.discount}
                  helperText={invoiceErrors.discount}
                  size="small"
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
            </Grid>
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              {invoiceData.discountType === 'percentage'
                ? 'Maximum: 90% (to ensure minimum invoice value)'
                : 'Maximum: 90% of product price'}
            </Typography>
          </Box>
        </Grid>

        {/* Amount Paid */}
        <Grid item xs={12}>
          <Box sx={{
            p: 2,
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(25, 118, 210, 0.04)',
            borderRadius: 1.5,
            border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.2)' : 'rgba(25, 118, 210, 0.12)'}`
          }}>
            <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 1.5, fontWeight: 600 }}>
              Payment Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="Amount Paid"
                  type="number"
                  value={invoiceData.amountPaid}
                  onChange={e => setInvoiceData({ ...invoiceData, amountPaid: e.target.value })}
                  error={!!invoiceErrors.amountPaid}
                  helperText={invoiceErrors.amountPaid}
                  size="small"
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
            </Grid>
            {totalWithVat > 0 && (
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                Total to be paid including vat is: {totalWithVat}
              </Typography>
            )
            }
          </Box>
        </Grid>


      </Grid>
    </Modal >
  )
}

export default InvoiceModal
