import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axios from '../axios'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export const getRoleFeaturesData: any = createAsyncThunk(
  'rolefeatures/find',
  async (data: any, { getState, dispatch }: Redux) => {
    data = { ...data, column: 'Role' }
    const response = await axios.post(`/api/backend/rolefeatures/findAssociated`, data)

    return response.data
  }
)

export const createRoleFeaturesData: any = createAsyncThunk(
  'rolefeatures/create',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/rolefeatures/create`, data)

    return response.data
  }
)

export const updateRoleFeaturesData: any = createAsyncThunk(
  'rolefeatures/update',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/rolefeatures/update`, data)

    return response.data
  }
)

export const deleteRoleFeaturesData: any = createAsyncThunk(
  'rolefeatures/delete',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/rolefeatures/delete`, data)

    return response.data
  }
)

export const rolefeatureslice = createSlice({
  name: 'rolefeatures',
  initialState: {
    count: 0,
    rows: [],
    loading: false
  },
  reducers: {},
  extraReducers: builders => {
    builders.addCase(getRoleFeaturesData.fulfilled, (state: any, action: any) => {
      state.rows = action.payload.data
      state.count = action.payload.count
      state.loading = false
    })
    builders.addCase(getRoleFeaturesData.pending, (state: any, action: any) => {
      state.loading = true
    })
    builders
      .addCase(createRoleFeaturesData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to update Data'
        state.loading = false
      })
      .addCase(updateRoleFeaturesData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to create Data'
        state.loading = false
      })
  }
})

export default rolefeatureslice.reducer
