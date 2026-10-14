import { createApi, fetBaseQuery } from '@reduxjs/toolkit/query/react'

const COIN_GECKO_API_KEY = import.meta.env.VITE_COINGECKO_API_KEY

const baseQuery = fetchBaseQuery({
	baseUrl: 'https://api.coingecko.com/api/v3/',
	prepareHeaders: (headers) => {
    if (COIN_GECKO_API_KEY) {
      headers.set('x-cg-demo-api-key', COIN_GECKO_API_KEY)
    }
    return headers
  },
})

