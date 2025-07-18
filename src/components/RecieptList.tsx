import Modal from 'src/components/Model/Model'
import ListSekeleton from 'src/components/ListSekeleton'
import DataGridTable from 'src/components/Datagrid'
import Typography from '@mui/material/Typography'
import { Grid, Button, Box, TextField } from '@mui/material';
import { GridColumns, GridRenderCellParams } from '@mui/x-data-grid'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import { getRecieptData, createRecieptData } from 'src/store/apps/invoice'
import { getBranchData } from 'src/store/apps/branch'

const columns: GridColumns = [
  {
    flex: 0.1,
    minWidth: 150,
    sortable: false,
    field: 'invoice_no',
    headerName: 'Invoice No',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['invoice_no']}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    sortable: false,
    field: 'name',
    headerName: 'Name',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.leads?.['name']}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    sortable: false,
    field: 'total',
    headerName: 'Total Amount',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['total']}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    sortable: false,
    field: 'discount',
    headerName: 'Discount',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['discount']}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    sortable: false,
    field: 'amount_paid',
    headerName: 'Amount Paid',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['amount_paid']}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    sortable: false,
    field: 'pending_amount',
    headerName: 'Pending Amount',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.['pending_amount']}
      </Typography>
    )
  },
]

const RecieptList = ({
  invoiceListOpen,
  handleInvoiceListClose,
  data
}: any) => {

  const dispatch = useDispatch();
  const router = useRouter();
  const [openReciepts, setOpenReciepts] = useState(false)
  const [openGenerateInvoice, setOpenGenerateInvoice] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>({})
  const [vatMultiplier, setVatMultiplier] = useState(1)
  const [vat, setVat] = useState(1)
  const [amountPaid, setAmountPaid] = useState('')
  const recieptsData = useSelector((state: any) => state.recieptList)

  const handleRecieptList = async (id: string) => {
    setOpenReciepts(true)
    await dispatch(getRecieptData({ invoice_id: id }))
  }

  const hanldeRecieptClose = () => {
    setOpenReciepts(false)
  }

  const showReciept = (reciept: any) => {
    router.push(`/invoice2?reciept_id=${reciept?.id}&invoice_id=${reciept?.invoice_id}`)
  }

  const handleSubmit = async () => {
    const invoice = await dispatch(createRecieptData({
      invoice_id: selectedInvoice?.id,
      amount_paid: parseFloat(amountPaid)
    }));
    router.push(`/invoice2?reciept_id=${invoice?.payload?.reciept?.id}&invoice_id=${invoice?.payload?.invoice?.id}`)
  }

  const generateInvoice = async (id: string, row: any) => {
    const res = await dispatch(getBranchData({
      where: [{
        column: '"branches"."id"',
        operator: '=',
        value: row?.leads?.branch_id
      }],
      joins: [{ column: 'Region' }]
    }))
    let vat = Number(res?.payload?.data?.[0]?.tax);
    setVat(vat)
    vat = (vat / 100);
    vat = row.total * vat;
    setVatMultiplier(row.pending_amount + vat);
    setSelectedInvoice(row)
    setOpenGenerateInvoice(true)
  }

  return (
    <Modal
      width={1200}
      isOpen={invoiceListOpen}
      onClose={handleInvoiceListClose}
      title="List of Invoice"
      height="100vh"
    >
      {
        (data.rows.length && !data.loading) > 0
          ? (
            <>
              <DataGridTable
                loading={data?.loading}
                checkBox={false}
                rows={data.rows}
                columns={columns}
                total={data.count}

                // pageSize={pageSize}
                // changePageSize={(newPageSize: number) => setPageSize(newPageSize)}
                // changePage={(newPage: number) => setPage(newPage)}
                edit={false}
                view={false}
                del={false}
                add={false}
                customActions={[
                  {
                    icon: <ReceiptIcon fontSize='medium' sx={{ color: '#28a745' }} />,
                    tooltip: 'Open Invoice',
                    onClick: handleRecieptList
                  },
                  {
                    icon: <ReceiptIcon fontSize='medium' sx={{ color: '#28a745' }} />,
                    tooltip: 'Generate Invoice for Pending Amount',
                    onClick: generateInvoice,
                    show: (row: any) => Number(row.pending_amount) > 0 // Removed to make button always visible
                  }
                ]}
              />
              {/* generate invoice for pending amount */}
              <Modal
                width={500}
                isOpen={openGenerateInvoice}
                onClose={() => setOpenGenerateInvoice(false)}
                onSubmit={handleSubmit}
                title="Generate Invoice for Pending Amount"
                mode='Add'
                height="50vh"
              >
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
                    <br />
                    <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 1.5, fontWeight: 600 }}>
                      Pending Amount : {selectedInvoice?.pending_amount}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={8}>
                        <TextField
                          fullWidth
                          label="Amount Paid"
                          type="number"
                          value={amountPaid}
                          onChange={e => setAmountPaid(e.target.value)}
                          size="small"
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      </Grid>
                    </Grid>
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                      Total to be paid including vat is: {vatMultiplier}
                    </Typography>
                  </Box>
                </Grid>
              </Modal>

              {/* Reciept List Modal */}
              <Modal
                width={500}
                isOpen={openReciepts}
                onClose={hanldeRecieptClose}
                title="List of reciepts"
                height="50vh"
              >
                {
                  !recieptsData?.loading && recieptsData?.rows?.length > 0
                    ?
                    (
                      <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                          Total Receipts: {recieptsData.rows.length}
                        </Typography>
                        <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1.5,
                          maxHeight: 'calc(50vh - 120px)',
                          overflowY: 'auto',
                          pr: 1
                        }}>
                          {recieptsData.rows.map((reciept: any, index: number) => (
                            <Box
                              key={reciept.id}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                                  transform: 'translateY(-1px)',
                                  boxShadow: (theme) => theme.shadows[2]
                                }
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    backgroundColor: 'success.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'success.contrastText'
                                  }}
                                >
                                  <ReceiptIcon fontSize="small" />
                                </Box>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                    Receipt #{reciept.reciept_no}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    Receipt {index + 1} of {recieptsData.rows.length}
                                  </Typography>
                                </Box>
                              </Box>
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => showReciept(reciept)}
                                sx={{
                                  minWidth: 'auto',
                                  px: 2,
                                  py: 1,
                                  backgroundColor: 'success.main',
                                  color: 'success.contrastText',
                                  '&:hover': {
                                    backgroundColor: 'success.dark'
                                  }
                                }}
                              >
                                View
                              </Button>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )
                    :
                    (
                      <ListSekeleton />
                    )
                }
              </Modal>
            </>
          )
          : (
            <ListSekeleton />
          )
      }
    </Modal>
  )
}

export default RecieptList
