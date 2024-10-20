import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axios from '../axios'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export const getRegionData: any = createAsyncThunk('region/find', async (data: any, { getState, dispatch }: Redux) => {
  data = { ...data, column: 'regions' }
  const response = await axios.post(`/api/backend/region/find`, data)

  return response.data
})

export const createRegionData: any = createAsyncThunk(
  'region/create',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/region/create`, data)

    return response.data
  }
)

export const updateRegionData: any = createAsyncThunk(
  'region/update',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/region/update`, data)

    return response.data
  }
)

export const regionlice = createSlice({
  name: 'region',
  initialState: {
    count: 0,
    rows: [],
    loading: false
  },
  reducers: {},
  extraReducers: builders => {
    builders.addCase(getRegionData.fulfilled, (state: any, action: any) => {
      state.rows = action.payload.data
      state.count = action.payload.count
      state.loading = false
    })
    builders.addCase(getRegionData.pending, (state: any, action: any) => {
      state.loading = true
    })
    builders
      .addCase(createRegionData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to update Data'
        state.loading = false
      })
      .addCase(updateRegionData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to create Data'
        state.loading = false
      })
  }
})

export default regionlice.reducer
