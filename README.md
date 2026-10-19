# CoinPulse

A responsive cryptocurrency dashboard built with React, Redux Toolkit, RTK Query, Chart.js, and Tailwind CSS.

## Start the app

Create a `.env.local` file in the project root and set your CoinGecko Demo API key:

VITE_COINGECKO_API_KEY=your_coingecko_demo_api_key

Then start the development server:

npm install
npm run dev

Use `npm run build` to create a production build and `npm run lint` to run ESLint.

Vite exposes `VITE_` environment variables to browser code. Do not use a key that must remain secret in a client-side app; use a server-side API proxy for production secrets.

## Dashboard features

- Browse the top 100 cryptocurrencies by market capitalization.
- Choose a quote currency and search for a coin by name or ticker.
- Compare up to five coins on a live price chart; switch between line/bar views and 1-day through 1-year ranges.
- Convert between supported national currencies and cryptocurrencies with numeric input validation.
- Review the portfolio allocation shown in the dashboard.

Market prices and history come from CoinGecko's API. Bitcoin, Ethereum, and Solana spot prices use CoinGecko's simple-price endpoint and refresh every 60 seconds; this is periodic polling rather than a streaming feed. National-currency exchange rates come from Frankfurter's public API. Public endpoints may apply rate limits; when data cannot be loaded, the dashboard displays an alert.

## Project structure

- `src/app/store.js` — Redux store configuration.
- `src/features/dashboard/dashboardSlice.js` — dashboard filters and selections.
- `src/services/coinGeckoApi.js` — RTK Query data endpoints.
- `src/App.jsx` — dashboard data orchestration and composition.
- `src/components/` — reusable dashboard sections styled with Tailwind CSS.
- `src/constants/dashboard.js` — supported currencies.
- `src/utils/formatMoney.js` — shared currency formatting helper.
