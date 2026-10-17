import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

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

// formatting chart label
function formatChartLabel(timestamp, days) {
  const date = new Date(timestamp)
  if (days === '1') {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
  }
  if (days === '7' || days === '30') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  return date.toLocaleDateString('en-US', { month: 'short' })
}

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
	      //processing response before storing result in cache
	      transformResponse: (coins) => coins.map((coin) => ({ // this transformation is producing the same output as the api response. Not changing the data structure
	        ...coin,
	        color: coin.color,
	      })),
    	}),

	    getSimplePrices: builder.query({
	      query: ({ ids, currency }) => ({
	        url: 'simple/price',
	        params: {
	          ids: ids.join(','),
	          vs_currencies: currency,
	        },
	      }),
	      // processing response from the api
	      // this transformation is is converting the output into an object after flattening the array from the response. 
	      transformResponse: (prices, _meta, { currency }) =>
	        Object.fromEntries(
	          Object.entries(prices).flatMap(([id, values]) =>
	            Number.isFinite(values[currency])
	              ? [[id, values[currency]]]
	              : [],
	          ),
	        ),
	    }),

	    getExchangeRates: builder.query({	// using frankfurter Api for exchange rates 
	      query: (baseCurrency) =>
	        `https://api.frankfurter.dev/v1/latest?base=${baseCurrency}`,
	    }),

	    getMarketHistory: builder.query({
	      async queryFn({ ids, currency, days }, _api, _extraOptions, runBaseQuery) {
	        // Fetching selected histories together and returning a single chart payload.
	        const responses = await Promise.all(ids.map(async (id) => ({
	          id,
	          response: await runBaseQuery({
	            url: `coins/${id}/market_chart`,
	            params: {
	              vs_currency: currency,
	              days,
	              ...(days === '1' ? { interval: 'hourly' } : {}),
	            },
	          }),
	        })))
	        const failedResponse = responses.find(({ response }) => response.error)
	        if (failedResponse) return { error: failedResponse.response.error }

	        const histories = responses.map(({ id, response }) => ({
	          id,
	          prices: response.data.prices,
	        }))
	        const timestamps = histories[0]?.prices.map(([timestamp]) => timestamp) ?? []
	        const labels = timestamps.map((timestamp) => formatChartLabel(timestamp, days))
	        const series = Object.fromEntries(histories.map(({ id, prices }) => [
	          id,
	          prices.map(([, price]) => price),
	        ]))

	        return { data: { labels, series } }
	      },
	    }),

	}),
})

export const {
  useGetExchangeRatesQuery,
  useGetMarketDataQuery,
  useGetMarketHistoryQuery,
  useGetSimplePricesQuery,
} = coinGeckoApi