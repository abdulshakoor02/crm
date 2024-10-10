import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axios from '../axios'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export const getFeaturesData: any = createAsyncThunk(
  'features/find',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/features/find`, data)

    return response.data
  }
)

export const createFeaturesData: any = createAsyncThunk(
  'features/create',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/features/create`, data)

    return response.data
  }
)

export const updateFeaturesData: any = createAsyncThunk(
  'features/update',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/features/update`, data)

    return response.data
  }
)

export const featureslice = createSlice({
  name: 'features',
  initialState: {
    count: 0,
    rows: [],
    loading: false
  },
  reducers: {},
  extraReducers: builders => {
    builders.addCase(getFeaturesData.fulfilled, (state: any, action: any) => {
      state.rows = action.payload.data
      state.count = action.payload.count
      state.loading = false
    })
    builders.addCase(getFeaturesData.pending, (state: any, action: any) => {
      state.loading = true
    })
    builders
      .addCase(createFeaturesData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to update Data'
        state.loading = false
      })
      .addCase(updateFeaturesData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to create Data'
        state.loading = false
      })
  }
})

export default featureslice.reducer
