import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axios from '../axios'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export const getLeadCategoryData: any = createAsyncThunk(
  'leadCategory/find',
  async (data: any, { getState, dispatch }: Redux) => {
    data = { ...data, column: 'lead_categories' }
    const response = await axios.post(`/api/backend/leadCategory/find`, data)
    console.log("lead app", response.data)
    return response.data
  }
)

export const createLeadCategoryData: any = createAsyncThunk(
  'leadCategory/create',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/leadCategory/create`, data)

    return response.data
  }
)

export const updateLeadCategoryData: any = createAsyncThunk(
  'leadCategory/update',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/leadCategory/update`, data)

    return response.data
  }
)

export const leadCategorySlice = createSlice({
  name: 'leadCategory',
  initialState: {
    count: 0,
    rows: [],
    loading: false
  },
  reducers: {},
  extraReducers: builders => {
    builders.addCase(getLeadCategoryData.fulfilled, (state: any, action: any) => {
      console.log("builder ", action);
      state.rows = action.payload.data
      state.count = action.payload.count
      state.loading = false
    })
    builders.addCase(getLeadCategoryData.pending, (state: any, action: any) => {
      state.loading = true
    })
    builders
      .addCase(createLeadCategoryData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to update Data'
        state.loading = false
      })
      .addCase(updateLeadCategoryData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to create Data'
        state.loading = false
      })
  }
})

export default leadCategorySlice.reducer
