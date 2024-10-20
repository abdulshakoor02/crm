import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axios from '../axios'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export const getAdditionalInfoData: any = createAsyncThunk(
  'additionalInfo/find',
  async (data: any, { getState, dispatch }: Redux) => {
    data = { ...data, column: 'additional_infos' }
    const response = await axios.post(`/api/backend/additionalInfo/find`, data)

    return response.data
  }
)

export const createAdditionalInfoData: any = createAsyncThunk(
  'additionalInfo/create',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/additionalInfo/create`, data)

    return response.data
  }
)

export const updateAdditionalInfoData: any = createAsyncThunk(
  'additionalInfo/update',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/additionalInfo/update`, data)

    return response.data
  }
)

export const additionalInfoSlice = createSlice({
  name: 'additionalInfo',
  initialState: {
    count: 0,
    rows: [],
    loading: false
  },
  reducers: {},
  extraReducers: builders => {
    builders.addCase(getAdditionalInfoData.fulfilled, (state: any, action: any) => {
      state.rows = action.payload.data
      state.count = action.payload.count
      state.loading = false
    })
    builders.addCase(getAdditionalInfoData.pending, (state: any, action: any) => {
      state.loading = true
    })
    builders
      .addCase(createAdditionalInfoData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to update Data'
        state.loading = false
      })
      .addCase(updateAdditionalInfoData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to create Data'
        state.loading = false
      })
  }
})

export default additionalInfoSlice.reducer
