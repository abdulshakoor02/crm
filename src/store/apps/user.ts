import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../axios'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export const getEmployeesData: any = createAsyncThunk(
  'employees/find',
  async (data: any, { getState, dispatch }: Redux) => {
    data = { ...data, column: 'employees' }
    const response = await axios.post(`/api/backend/employees/findAssociated`, data)

    return response.data
  }
)

export const createEmployeesData: any = createAsyncThunk(
  'employees/create',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/employees/create`, data)

    return response.data
  }
)

export const updateEmployeesData: any = createAsyncThunk(
  'employees/update',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/employees/update`, data)

    return response.data
  }
)

export const employeesSlice = createSlice({
  name: 'employees',
  initialState: {
    count: 0,
    rows: [],
    loading: false
  },
  reducers: {},
  extraReducers: builders => {
    builders.addCase(getEmployeesData.fulfilled, (state: any, action: any) => {
      state.rows = action.payload.data
      state.count = action.payload.count
      state.loading = false
    })
    builders.addCase(getEmployeesData.pending, (state: any, action: any) => {
      state.loading = true
    })
    builders
      .addCase(createEmployeesData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to update Data'
        state.loading = false
      })
      .addCase(updateEmployeesData.rejected, (state: any, action: any) => {
        state.error = action.payload || 'failed to create Data'
        state.loading = false
      })
  }
})

export default employeesSlice.reducer
