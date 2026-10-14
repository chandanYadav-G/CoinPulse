import { createApi, fetBaseQuery } from '@reduxjs/toolkit/query/react'

const COIN_GECKO_API_KEY = import.meta.env.VITE_COINGECKO_API_KEY

// creating base query
const baseQuery = fetchBaseQuery({
	baseUrl: 'https://api.coingecko.com/api/v3/',
	prepareHeaders: (headers) => {
    if (COIN_GECKO_API_KEY) {
      headers.set('x-cg-demo-api-key', COIN_GECKO_API_KEY)
    }
    return headers
  },
})

// centralizing market data, quotes, history, and fiat-rate caching
export const coinGeckoApi = createApi({
	reducerPath: 'coinGeckoApi',
	baseQuery,
	endpoints: (builder) => ({ // defining endpoints
		getMarketData: builder.query({
	      query: (currency) => ({
	        url: 'coins/markets',
	        params: {
	          vs_currency: currency,
	          order: 'market_cap_desc',
	          per_page: 100,
	          page: 1,
	          sparkline: false,
	          price_change_percentage: '24h',
	        },
	      }),
	      // processing response before storing result in cache
	      transformResponse: (coins) => coins.map((coin) => ({
	        ...coin,
	        color: coin.color,
	      })),
    	}),
	}),
})