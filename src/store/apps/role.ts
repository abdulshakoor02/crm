import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axios from '../axios'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export const getRoleData: any = createAsyncThunk('role/find', async (data: any, { getState, dispatch }: Redux) => {
  data = { ...data, column: 'roles' }
  const response = await axios.post(`/api/backend/role/find`, data)

  return response.data
})

export const createRoleData: any = createAsyncThunk('role/create', async (data: any, { getState, dispatch }: Redux) => {
  const response = await axios.post(`/api/backend/role/create`, data)

  return response.data
})

export const updateRoleData: any = createAsyncThunk('role/update', async (data: any, { getState, dispatch }: Redux) => {
  const response = await axios.post(`/api/backend/role/update`, data)

  return response.data
})

export const rolelice = createSlice({
  name: 'role',
  initialState: {
    count: 0,
    rows: [],
    loading: false
  },
  reducers: {},
  extraReducers: builders => {
    builders.addCase(getRoleData.fulfilled, (state: any, action: any) => {
      state.rows = action.payload.data
      state.count = action.payload.count
      state.loading = false
    })
    builders.addCase(getRoleData.pending, (state: any, action: any) => {
      state.loading = true
    })
    builders
      .addCase(createRoleData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to update Data'
        state.loading = false
      })
      .addCase(updateRoleData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to create Data'
        state.loading = false
      })
  }
})

export default rolelice.reducer
