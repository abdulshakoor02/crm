import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit'

import axios from '../axios'
import { Redux } from 'src/types/redux'
import { Country, CountryState } from 'src/types/redux/country.types'

export const getCountriesData: any = createAsyncThunk(
  'country/find',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/country/find`, { ...data })

    return response.data
  }
)

export const createCountryData: any = createAsyncThunk(
  'country/create',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await axios.post(`/api/backend/country/create`, data)
    return response.data
  }
)

export const updateCountryData: any = createAsyncThunk('country/update', async (data: any, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/api/backend/country/update`, { ...data })
    return response.data
  } catch (error) {
    console.log('error updating country ', error)
    return rejectWithValue('Error updating country')
  }
})

export const countrySlice = createSlice({
  name: 'country',
  initialState: {
    count: 0,
    rows: [] as Country[], // Type for rows is defined here
    loading: false, // Add loading state
    error: null // Add error state
  } as CountryState, // The state structure is typed
  reducers: {},
  extraReducers: builders => {
    // Handle loading states
    builders
      .addCase(getCountriesData.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(createCountryData.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCountryData.pending, state => {
        state.loading = true
        state.error = null
      })

    // Handle fulfilled states
    builders
      .addCase(getCountriesData.fulfilled, (state, action) => {
        state.rows = action.payload.data
        state.count = action.payload.count
        state.loading = false
      })
      .addCase(createCountryData.fulfilled, (state, action) => {
        // state.rows.push(action.payload); // Add newly created country to state
        state.loading = false
      })
      .addCase(updateCountryData.fulfilled, (state, action) => {
        // const index = state.rows.findIndex((country) => country.id === action.payload.id);
        // if (index !== -1) {
        //   state.rows[index] = action.payload; // Update existing country in state
        // }
        state.loading = false
      })

    // Handle rejected states (error handling)
    builders
      .addCase(getCountriesData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch countries'
      })
      .addCase(createCountryData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to create country'
      })
      .addCase(updateCountryData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to update country'
      })
  }
})

export default countrySlice.reducer
