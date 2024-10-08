import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axios from '../axios'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export const getBranchData: any = createAsyncThunk('branch/find', async (data: any, { getState, dispatch }: Redux) => {
  const response = await axios.post(`/api/backend/branch/findAssociated`, data)

  return response.data
})

export const createBranchData: any = createAsyncThunk(
  'branch/create',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/branch/create`, data)

    return response.data
  }
)

export const updateBranchData: any = createAsyncThunk(
  'branch/update',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/branch/update`, data)

    return response.data
  }
)

export const branchlice = createSlice({
  name: 'branch',
  initialState: {
    count: 0,
    rows: [],
    loading: false
  },
  reducers: {},
  extraReducers: builders => {
    builders.addCase(getBranchData.fulfilled, (state: any, action: any) => {
      state.rows = action.payload.data
      state.count = action.payload.count
      state.loading = false
    })
    builders.addCase(getBranchData.pending, (state: any, action: any) => {
      state.loading = true
    })
    builders
      .addCase(createBranchData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to update Data'
        state.loading = false
      })
      .addCase(updateBranchData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to create Data'
        state.loading = false
      })
  }
})

export default branchlice.reducer
