import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axios from '../axios'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export const getInvoiceData: any = createAsyncThunk(
  'invoice/find',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/invoice/find`, data)

    return response.data
  }
)

export const getRecieptData: any = createAsyncThunk(
  'reciepts/find',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/reciepts/find`, data)

    return response.data
  }
)

export const getSingleInvoiceData: any = createAsyncThunk(
  'invoice/findone',
  async (data: any, { getState, dispatch }: Redux) => {
    data = { ...data, column: 'invoice' }
    const response = await axios.post(`/api/backend/invoice/findone`, data)

    return response.data
  }
)

export const createInvoiceData: any = createAsyncThunk(
  'invoice/create',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/invoice/create`, data)

    return response.data
  }
)

export const createRecieptData: any = createAsyncThunk(
  'reciept/create',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/reciept/create`, data)

    return response.data
  }
)

export const updateInvoiceData: any = createAsyncThunk(
  'invoice/update',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/invoice/update`, data)

    return response.data
  }
)

export const invoiceslice = createSlice({
  name: 'invoice',
  initialState: {
    count: 0,
    rows: [],
    data: {},
    loading: false
  },
  reducers: {},
  extraReducers: builders => {
    builders.addCase(getSingleInvoiceData.fulfilled, (state: any, action: any) => {
      state.data = action.payload
      state.loading = false
    })
    builders.addCase(getSingleInvoiceData.pending, (state: any, action: any) => {
      state.loading = true
    })
    builders
      .addCase(createInvoiceData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to update Data'
        state.loading = false
      })
      .addCase(updateInvoiceData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to create Data'
        state.loading = false
      })
  }
})

const invoiceListslice = createSlice({
  name: 'invoiceList',
  initialState: {
    count: 0,
    rows: [],
    loading: false
  },
  reducers: {},
  extraReducers: builders => {
    builders.addCase(getInvoiceData.fulfilled, (state: any, action: any) => {
      state.rows = action.payload.data
      state.count = action.payload.count
      state.loading = false
    })

    builders.addCase(getInvoiceData.pending, (state: any) => {
      state.loading = true
    })
  }
})

const recieptListslice = createSlice({
  name: 'recieptList',
  initialState: {
    count: 0,
    rows: [],
    loading: false
  },
  reducers: {},
  extraReducers: builders => {
    builders.addCase(getRecieptData.fulfilled, (state: any, action: any) => {
      state.rows = action.payload.data
      state.count = action.payload.count
      state.loading = false
    })

    builders.addCase(getRecieptData.pending, (state: any) => {
      state.loading = true
    })
  }
})

export const invoiceList = invoiceListslice.reducer;

export const recieptList = recieptListslice.reducer;

export default invoiceslice.reducer
