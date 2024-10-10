// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import country from '../store/apps/countries'
import tenant from '../store/apps/tenant'
import user from '../store/apps/user'
import region from '../store/apps/region'
import branch from '../store/apps/branch'
import role from '../store/apps/role'
import feature from '../store/apps/feature'

export const store = configureStore({
  reducer: {
    country,
    tenant,
    region,
    branch,
    role,
    feature,
    user
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
