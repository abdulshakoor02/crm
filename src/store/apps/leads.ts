import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axios from '../axios'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export const getLeadData: any = createAsyncThunk('lead/find', async (data: any, { getState, dispatch }: Redux) => {
  data = { ...data, column: 'leads' }
  const { features, id } = JSON.parse(window.localStorage.getItem('userData'))
  if (features.includes('self')) {
    data = { ...data, find: { employee_id: id } }
  }
  const response = await axios.post(`/api/backend/lead/find`, data)

  return response.data
})

export const createLeadData: any = createAsyncThunk('lead/create', async (data: any, { getState, dispatch }: Redux) => {
  const { features, id } = JSON.parse(window.localStorage.getItem('userData'))
  if (features.includes('self')) {
    data = data.map(val => ({ ...val, employee_id: id }))
  }
  console.log(data)
  const response = await axios.post(`/api/backend/lead/create`, data)

  return response.data
})

export const updateLeadData: any = createAsyncThunk('lead/update', async (data: any, { getState, dispatch }: Redux) => {
  const response = await axios.post(`/api/backend/lead/update`, data)

  return response.data
})

export const leadSlice = createSlice({
  name: 'lead',
  initialState: {
    count: 0,
    rows: [],
    loading: false
  },
  reducers: {},
  extraReducers: builders => {
    builders.addCase(getLeadData.fulfilled, (state: any, action: any) => {
      state.rows = action.payload.data
      state.count = action.payload.count
      state.loading = false
    })
    builders.addCase(getLeadData.pending, (state: any, action: any) => {
      state.loading = true
    })
    builders
      .addCase(createLeadData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to update Data'
        state.loading = false
      })
      .addCase(updateLeadData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to create Data'
        state.loading = false
      })
  }
})

export default leadSlice.reducer
