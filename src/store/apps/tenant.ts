import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axios from '../axios'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export const getTenantData: any = createAsyncThunk('tenant/find', async (data: any, { getState, dispatch }: Redux) => {
  const response = await axios.post(`/api/backend/tenants/findAssociated`, data)

  return response.data
})

export const createTenantData: any = createAsyncThunk(
  'tenant/create',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/tenants/create`, data)

    return response.data
  }
)

export const updateTenantData: any = createAsyncThunk(
  'tenant/update',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/tenants/update`, data)

    return response.data
  }
)

export const tenantSlice = createSlice({
  name: 'tenant',
  initialState: {
    count: 0,
    rows: [],
    loading: false
  },
  reducers: {},
  extraReducers: builders => {
    builders.addCase(getTenantData.fulfilled, (state: any, action: any) => {
      state.rows = action.payload.data
      state.count = action.payload.count
      state.loading = false
    })
    builders.addCase(getTenantData.pending, (state: any, action: any) => {
      state.loading = true
    })
    builders
      .addCase(createTenantData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to update Data'
        state.loading = false
      })
      .addCase(updateTenantData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to create Data'
        state.loading = false
      })
  }
})

export default tenantSlice.reducer
