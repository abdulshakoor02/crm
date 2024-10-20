import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axios from '../axios'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export const getProductData: any = createAsyncThunk(
  'products/find',
  async (data: any, { getState, dispatch }: Redux) => {
    data = { ...data, column: 'products' }
    const response = await axios.post(`/api/backend/products/find`, data)

    return response.data
  }
)

export const createProductData: any = createAsyncThunk(
  'products/create',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/products/create`, data)

    return response.data
  }
)

export const updateProductData: any = createAsyncThunk(
  'products/update',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/products/update`, data)

    return response.data
  }
)

export const productslice = createSlice({
  name: 'products',
  initialState: {
    count: 0,
    rows: [],
    loading: false
  },
  reducers: {},
  extraReducers: builders => {
    builders.addCase(getProductData.fulfilled, (state: any, action: any) => {
      state.rows = action.payload.data
      state.count = action.payload.count
      state.loading = false
    })
    builders.addCase(getProductData.pending, (state: any, action: any) => {
      state.loading = true
    })
    builders
      .addCase(createProductData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to update Data'
        state.loading = false
      })
      .addCase(updateProductData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to create Data'
        state.loading = false
      })
  }
})

export default productslice.reducer
