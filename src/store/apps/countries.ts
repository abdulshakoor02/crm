import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axios from '../axios'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export const getCountriesData: any = createAsyncThunk(
  'country/find',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/country/find`, { ...data })

    return response.data
  }
)

export const countrySlice = createSlice({
  name: 'country',
  initialState: {
    count: 0,
    rows: []
  },
  reducers: {},
  extraReducers: builders => {
    builders.addCase(getCountriesData.fulfilled, (state: any, action: any) => {
      state.rows = action.payload.data
      state.count = action.payload.count
    })
  }
})

export default countrySlice.reducer
