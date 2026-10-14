import { createSlice } from '@reduxjs/toolkit'

// created dashboardSlice, defined initialState
const dashboardSlice  = createSlice({
	name: 'dashboard',

	initialState: {
		baseCurrency: 'USD',
		chartType: 'Line',
		range: '7',
		search: '',
		selectedCoins: ['ethereum']
	},

	reducers: {
		setBaseCurrency: (state, action) => { state.baseCurrency = action.payload },
		setChartType: (state, action) => { state.chartType = action.payload },
		setRange: (state, action) => { state.range = action.payload },
		setSearch: (state, action) => { state.search = action.payload },
		setSelectedCoins: (state, action) => { state.selectedCoins = action.payload },
	},
})

export const {
	setBaseCurrency,
	setChartType,
	setRange,
	setSearch,
	setSelectedCoins,
} = dashboardSlice.actions

export default dashboardSlice.reducer