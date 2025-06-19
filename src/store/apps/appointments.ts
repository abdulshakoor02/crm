import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axios from '../axios'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export const getAppointmentsData: any = createAsyncThunk(
  'appointment/find',
  async (data: any, { getState, dispatch }: Redux) => {
    data = { ...data, column: 'additional_infos' }
    const response = await axios.post(`/api/backend/appointment/find`, data)

    return response.data
  }
)

export const createAppointmentsData: any = createAsyncThunk(
  'appointment/create',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/appointment/create`, data)

    return response.data
  }
)

export const updateAppointmentsData: any = createAsyncThunk(
  'appointment/update',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/appointment/update`, data)

    return response.data
  }
)

export const appointmentSlice = createSlice({
  name: 'appointment',
  initialState: {
    count: 0,
    rows: [],
    loading: false
  },
  reducers: {},
  extraReducers: builders => {
    builders.addCase(getAppointmentsData.fulfilled, (state: any, action: any) => {
      state.rows = action.payload.data
      state.count = action.payload.count
      state.loading = false
    })
    builders.addCase(getAppointmentsData.pending, (state: any, action: any) => {
      state.loading = true
    })
    builders
      .addCase(createAppointmentsData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to update Data'
        state.loading = false
      })
      .addCase(updateAppointmentsData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to create Data'
        state.loading = false
      })
  }
})

export default appointmentSlice.reducer
