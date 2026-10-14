import { configureStore } from '@reduxjs/toolkit'
import dashboardReducer from '../features/dashboard/dashboardSlice'
import { coinGeckoApi } from '../services/coinGeckoApi'

//created store
export const store = configureStore({
	reducer: {
		dashboard: dashboardReducer,
		[coinGeckoApi.reducerPath]: coinGeckoApi.reducer,
	},
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(coinGeckoApi.middleware),
})