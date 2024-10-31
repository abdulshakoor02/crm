
import { CardContent, Grid, Theme, Typography, useTheme, Box, Card, TextField, InputAdornment, Divider, TableContainer, Table, TableBody, TableRow, styled, alpha, CardContentProps, GridProps, Collapse, Select, BoxProps, IconButton, Button, Tooltip, InputLabel } from '@mui/material'
import React, { forwardRef, useState, ForwardedRef, SyntheticEvent } from 'react'


// import DatePicker from 'react-datepicker'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import TableCell, { TableCellBaseProps } from '@mui/material/TableCell'
import FormTextField from 'src/pages/components/FormtextField';
// ** Custom Component Imports
import Repeater from 'src/@core/components/repeater'
import { Close } from '@mui/icons-material';
import { Plus } from 'mdi-material-ui';
import toast from 'react-hot-toast';



const InvoiceConfig = {
    name: "Materio"
}

const client = {
  company: "Hall-Robbins PLC",
  address: "7777 Mendez Plains",
  contact: "(616) 865-4180",
  companyEmail: "don85@johnson.com"
}

interface PickerProps {
  label?: string
}

const MUITableCell = styled(TableCell)<TableCellBaseProps>(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  paddingTop: `${theme.spacing(1)} !important`,
  paddingBottom: `${theme.spacing(1)} !important`
}))

const RepeaterWrapper = styled(CardContent)<CardContentProps>(({ theme }) => ({
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(12),
  '& .repeater-wrapper + .repeater-wrapper': {
    marginTop: theme.spacing(12)
  }
}))

const RepeatingContent = styled(Grid)<GridProps>(({ theme }) => ({
  paddingRight: 0,
  display: 'flex',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '& .col-title': {
    top: '-1.5rem',
    position: 'absolute'
  },
  [theme.breakpoints.down('lg')]: {
    '& .col-title': {
      top: '0',
      position: 'relative'
    }
  }
}))


const InvoiceAction = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: theme.spacing(2, 1),
  borderLeft: `1px solid ${theme.palette.divider}`
}))

const CalcWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '&:not(:last-of-type)': {
      marginBottom: theme.spacing(2)
    }
  }))

const now = new Date()
const tomorrowDate = now.setDate(now.getDate() + 7)

const Invoice = () => {
  const [issueDate, setIssueDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(new Date(tomorrowDate));
  const [selected, setSelected] = useState<string>('Test');
  const [count, setCount] = useState(1);
 const [items, setItems] = useState([{ productId: 0, hours: 0, cost: 0 }]); // State for items
 const [tax, setTax] = useState(21); // Tax percentage as a fixed state for now

// Calculate subtotal by summing up cost * hours for each item
const subtotal = items.reduce((acc, item) => acc + item.cost * item.hours, 0);

// Calculate total by applying the tax to the subtotal
const total = subtotal * (1 + tax / 100);
const invoiceNumber = 100;

  const theme: Theme = useTheme();

  const products = [
    {
      id:1, label: 'App Design', value: 'App Design', price: 20
    },
    {
      id:2, label: 'App Customization', value: 'App Customization', price: 50
    },
    {
      id:3, label: 'ABC Template', value: 'ABC Template', price: 100
    },
    {
      id:4, label: 'App Development', value: 'App Development', price: 150
    },
  ]

  

    const handleAddItem = () => {
      // When adding a new item, initialize its details
      setItems([...items, { productId: 0, hours: 0, cost: 0 }]); // Add new item with empty fields
    };
  
    const handleSelectProduct = (index: number, productId:  number) => {
      const selectedProduct = products.find(product => product.id === productId);
      if(!selectedProduct) return toast.error("Selected product not found");
      const newItems = [...items];
      newItems[index] = { ...newItems[index], productId: selectedProduct.id, cost: selectedProduct.price };
      setItems(newItems);
    };
  
    const handleHourChange = (index: number, value: number) => {
      const newItems = [...items];
      newItems[index].hours = value; // Update the hours for the specific item
      setItems(newItems);
    };

    const handlePriceChange = (index: number, value: number) => {
      const newItems = [...items];
      newItems[index].cost = value; // Update the price for the specific item
      setItems(newItems);
    }
  
    const handleRemoveItem = (index: number) => {
      const newItems = items.filter((_, i) => i !== index); // Remove item by index
      setItems(newItems);
    };

  return (
    <Card>
    <CardContent>
      <Grid container>
        <Grid item xl={6} xs={12} sx={{ mb: { xl: 0, xs: 4 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
              <svg
                width={30}
                height={25}
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
                      <polygon
                        id='Rectangle'
                        opacity='0.077704'
                        fill={theme.palette.common.black}
                        points='0 8.58870968 7.25806452 12.7505183 7.25806452 16.8305646'
                      />
                      <polygon
                        id='Rectangle'
                        opacity='0.077704'
                        fill={theme.palette.common.black}
                        points='0 8.58870968 7.25806452 12.6445567 7.25806452 15.1370162'
                      />
                      <polygon
                        id='Rectangle'
                        opacity='0.077704'
                        fill={theme.palette.common.black}
                        points='22.7419355 8.58870968 30 12.7417372 30 16.9537453'
                        transform='translate(26.370968, 12.771227) scale(-1, 1) translate(-26.370968, -12.771227) '
                      />
                      <polygon
                        id='Rectangle'
                        opacity='0.077704'
                        fill={theme.palette.common.black}
                        points='22.7419355 8.58870968 30 12.6409734 30 15.2601969'
                        transform='translate(26.370968, 11.924453) scale(-1, 1) translate(-26.370968, -11.924453) '
                      />
                      <path
                        id='Rectangle'
                        fillOpacity='0.15'
                        fill={theme.palette.common.white}
                        d='M3.04512412,1.86636639 L15,9.19354839 L15,9.19354839 L15,17.1774194 L0,8.58649679 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 Z'
                      />
                      <path
                        id='Rectangle'
                        fillOpacity='0.35'
                        fill={theme.palette.common.white}
                        transform='translate(22.500000, 8.588710) scale(-1, 1) translate(-22.500000, -8.588710) '
                        d='M18.0451241,1.86636639 L30,9.19354839 L30,9.19354839 L30,17.1774194 L15,8.58649679 L15,3.5715689 C15,2.4669994 15.8954305,1.5715689 17,1.5715689 C17.3688953,1.5715689 17.7306035,1.67359571 18.0451241,1.86636639 Z'
                      />
                    </g>
                  </g>
                </g>
              </svg>
              <Typography
                variant='h6'
                sx={{ ml: 2.5, fontWeight: 600, lineHeight: 'normal', textTransform: 'uppercase' }}
              >
                {InvoiceConfig.name}
              </Typography>
            </Box>
            <Box>
                <Typography variant='body2' sx={{ mb: 1 }}>
                  Office 149, 450 South Brand Brooklyn
                </Typography>
                <Typography variant='body2' sx={{ mb: 1 }}>
                  San Diego County, CA 91905, USA
                </Typography>
                <Typography variant='body2'>+1 (123) 456 7891, +44 (876) 543 2198</Typography>
              </Box>
          </Box>
        </Grid>
        <Grid item xl={6} xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xl: 'flex-end', xs: 'flex-start' } }}>
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                  <Typography variant='h6' sx={{ mr: 2, width: '105px' }}>
                    Invoice
                  </Typography>
                  <TextField
                    size='small'
                    value={invoiceNumber}
                    sx={{ width: { sm: '250px', xs: '170px' } }}
                    InputProps={{
                      disabled: true,
                      startAdornment: <InputAdornment position='start'>#</InputAdornment>
                    }}
                  />
                </Box>
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                  <Typography variant='body2' sx={{ mr: 3, width: '100px' }}>
                    Date Issued:
                  </Typography>
                    <DatePicker
                      label="Basic date picker"
                      value={issueDate}
                      onChange={(date: Date | null) => {
                        if (date !== null) {
                          setIssueDate(date);
                        }
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Typography variant='body2' sx={{ mr: 3, width: '100px' }}>
                    Date Due:
                  </Typography>
                   <DatePicker
                      label="Basic date picker"
                      value={dueDate}
                      onChange={(date: Date | null) => {
                        if (date !== null) {
                          setDueDate(date);
                        }
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                </Box>
                
              </Box>
            </LocalizationProvider>
          </Grid>
       </Grid>
    </CardContent>     
    <Divider />  
    <CardContent>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: { lg: 0, xs: 4 } }}>
            <Typography variant='body2' sx={{ mb: 3.5, color: 'text.primary', fontWeight: 600 }}>
              Invoice To:
            </Typography>
            <TextField
              size="small"
              value={selected}
              variant="outlined"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              sx={{ mb: 4, width: '200px' }}
            />
            {client !== null && client !== undefined ? (
              <Box>
                <Typography variant='body2' sx={{ mb: 1 }}>
                  {client.company}
                </Typography>
                <Typography variant='body2' sx={{ mb: 1 }}>
                  {client.address}
                </Typography>
                <Typography variant='body2' sx={{ mb: 1 }}>
                  {client.contact}
                </Typography>
                <Typography variant='body2' sx={{ mb: 1 }}>
                  {client.companyEmail}
                </Typography>
              </Box>
            ) : null}
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: ['flex-start', 'flex-end'] }}>
            <div>
              <Typography variant='body2' sx={{ mb: 3.5, color: 'text.primary', fontWeight: 600 }}>
                Bill To:
              </Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <MUITableCell>Total Due:</MUITableCell>
                      <MUITableCell>$12,110.55</MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>Bank name:</MUITableCell>
                      <MUITableCell>American Bank</MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>Country:</MUITableCell>
                      <MUITableCell>United States</MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>IBAN:</MUITableCell>
                      <MUITableCell>ETD95476213874685</MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>SWIFT code:</MUITableCell>
                      <MUITableCell>BR91905</MUITableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Grid>
        </Grid>
      </CardContent>
      <Divider/>
      <RepeaterWrapper>
      <Repeater count={count}>
        {(i: number) => {
          const Tag = i === 0 ? Box : Collapse;

          return (
            <Tag key={i} className='repeater-wrapper' {...(i !== 0 ? { in: true } : {})}>
              <Grid container>
                <RepeatingContent item xs={12}>
                  <Grid container sx={{ py: 4, width: '100%', pr: { lg: 0, xs: 4 } }}>
                    <Grid item lg={6} md={5} xs={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                      <Typography
                        variant='body2'
                        className='col-title'
                        sx={{ fontWeight: '600', mb: { md: 2, xs: 0 } }}
                      >
                        Item
                      </Typography>
                      <Select
                        fullWidth
                        size='small'
                        value={items[i].productId}
                        onChange={(e) => handleSelectProduct(i, Number(e.target.value))}
                      >
                        {products.map((product) => (
                          <MenuItem key={product.id} value={product.id}>{product.label}</MenuItem>
                        ))}
                      </Select>
                      <TextField
                          rows={2}
                          fullWidth
                          multiline
                          size='small'
                          sx={{ mt: 3.5 }}
                          defaultValue='Customization & Bug Fixes'
                        />
                    </Grid>
                    <Grid item lg={2} md={3} xs={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                      <Typography
                        variant='body2'
                        className='col-title'
                        sx={{ fontWeight: '600', mb: { md: 2, xs: 0 } }}
                      >
                        Cost
                      </Typography>
                      <TextField
                        size='small'
                        type='number'
                        placeholder='0'
                        value={items[i].cost} // Display the cost based on selection
                        // InputProps={{ inputProps: { min: 0 }, readOnly: true }} // Make it read-only
                        onChange={(e) => handlePriceChange(i, Number(e.target.value))}
                      />
                       <Box sx={{ mt: 3.5 }}>
                          <Typography component='span' variant='body2'>
                            Discount:
                          </Typography>{' '}
                          <Typography component='span' variant='body2'>
                            0%
                          </Typography>
                          <Tooltip title='Tax 1' placement='top'>
                            <Typography component='span' variant='body2' sx={{ mx: 2 }}>
                              0%
                            </Typography>
                          </Tooltip>
                          <Tooltip title='Tax 2' placement='top'>
                            <Typography component='span' variant='body2'>
                              0%
                            </Typography>
                          </Tooltip>
                        </Box>
                    </Grid>
                    <Grid item lg={2} md={2} xs={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                      <Typography
                        variant='body2'
                        className='col-title'
                        sx={{ fontWeight: '600', mb: { md: 2, xs: 0 } }}
                      >
                        Hours
                      </Typography>
                      <TextField
                        size='small'
                        type='number'
                        placeholder='0'
                        value={items[i].hours || ''} // Controlled input
                        onChange={(e) => handleHourChange(i, Number(e.target.value))}
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>
                    <Grid item lg={2} md={1} xs={12} sx={{ px: 4, my: { lg: 0 }, mt: 2 }}>
                      <Typography
                        variant='body2'
                        className='col-title'
                        sx={{ fontWeight: '600', mb: { md: 2, xs: 0 } }}
                      >
                        Price
                      </Typography>
                      <Typography>${(items[i].cost * items[i].hours).toFixed(2)}</Typography> {/* Total Price Calculation */}
                    </Grid>
                  </Grid>
                  <InvoiceAction>
                    <IconButton size='small' onClick={() => handleRemoveItem(i)}>
                      <Close fontSize='small' />
                    </IconButton>
                  </InvoiceAction>
                </RepeatingContent>
              </Grid>
            </Tag>
          );
        }}
      </Repeater>

      <Grid container sx={{ mt: 4 }}>
        <Grid item xs={12} sx={{ px: 0 }}>
          <Button
            size='small'
            variant='contained'
            startIcon={<Plus fontSize='small' />}
            onClick={handleAddItem}
          >
            Add Item
          </Button>
        </Grid>
      </Grid>
    </RepeaterWrapper>

    <Divider />

    <CardContent>
        <Grid container>
          <Grid item xs={12} sm={9} sx={{ order: { sm: 1, xs: 2 } }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <Typography variant='body2' sx={{ mr: 2, fontWeight: 600 }}>
                Salesperson:
              </Typography>
              <TextField size='small' sx={{ maxWidth: '150px' }} defaultValue='Tommy Shelby' />
            </Box>
            <TextField size='small' sx={{ maxWidth: '300px' }} placeholder='Thanks for your business' />
          </Grid>
          <Grid item xs={12} sm={3} sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}>
            <CalcWrapper>
              <Typography variant='body2'>Subtotal:</Typography>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
              ${subtotal.toFixed(2)}
              </Typography>
            </CalcWrapper>
            <CalcWrapper>
              <Typography variant='body2'>Discount:</Typography>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                $0
              </Typography>
            </CalcWrapper>
            <CalcWrapper>
              <Typography variant='body2'>Tax:</Typography>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
              {tax}%
              </Typography>
            </CalcWrapper>
            <Divider />
            <CalcWrapper>
              <Typography variant='body2'>Total:</Typography>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
              ${total.toFixed(2)}
              </Typography>
            </CalcWrapper>
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

<CardContent>
  <InputLabel htmlFor='invoice-note' sx={{ mb: 2 }}>
    Note:
  </InputLabel>
  <TextField
    rows={2}
    fullWidth
    multiline
    id='invoice-note'
    defaultValue='It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance projects. Thank You!'
  />
</CardContent>

    </Card> 

  )
}

export default Invoice