import { configureStore } from '@reduxjs/toolkit'
import dashboardReducer from '../features/dashboard/dashboardSlice'

//created store
export const store = configureStore({
	reducer: {
		dashboard: dashboardReducer,
	}
})