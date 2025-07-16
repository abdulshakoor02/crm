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

import { getRecieptData } from 'src/store/apps/invoice'

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
  const [selectedInvoice, setSelectedInvoice] = useState({})
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

  const generateInvoice = (id: string, row: any) => {
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
                title="Generate Invoice for Pending Amount"
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
                    {/*
                      <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                        Total to be paid including vat is: {totalWithVat}
                      </Typography>
                    */}
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
                      <>
                        {
                          recieptsData.rows.map((reciept: any) => (
                            <>
                              <span style={{ color: 'black' }}>Reciept No: {reciept.reciept_no}</span>
                              <Button onClick={() => (showReciept(reciept))}>
                                <ReceiptIcon fontSize='medium' sx={{ color: '#28a745' }} />
                              </Button>
                            </>
                          ))
                        }
                      </>
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
{/*

*/}
