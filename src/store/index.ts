// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import country from '../store/apps/countries'
import tenant from '../store/apps/tenant'
import user from '../store/apps/user'
import region from '../store/apps/region'
import branch from '../store/apps/branch'
import role from '../store/apps/role'
import features from '../store/apps/feature'
import rolefeatures from '../store/apps/rolefeatures'
import products from '../store/apps/product'
import leads from '../store/apps/leads'
import leadCategory from '../store/apps/leadCategory'
import additionalInfo from '../store/apps/additionalInfo'
import appointments from '../store/apps/appointments'
import invoice from '../store/apps/invoice'
import { invoiceList, recieptList } from '../store/apps/invoice'

export const store = configureStore({
  reducer: {
    country,
    tenant,
    region,
    branch,
    role,
    features,
    rolefeatures,
    products,
    leads,
    leadCategory,
    additionalInfo,
    user,
    appointments,
    invoice,
    invoiceList,
    recieptList
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
