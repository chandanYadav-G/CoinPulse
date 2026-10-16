import { useDispatch, useSelector } from 'react-redux'

import {
  selectBaseCurrency,
  selectChartType,
  selectRange,
  selectSearch,
  selectSelectedCoinIds,
  setBaseCurrency,
  setChartType,
  setRange,
  setSearch,
  setSelectedCoinIds,
} from './features/dashboard/dashboardSlice'

import {
  useGetExchangeRatesQuery,
  useGetMarketDataQuery,
  useGetMarketHistoryQuery,
  useGetSimplePricesQuery,
} from './services/coinGeckoApi'

import { currencies } from './constants/dashboard'
import DashboardHeader from './components/DashboardHeader'
import ExchangeCard from './components/ExchangeCard'
import MarketCapList from './components/MarketCapList'
import PortfolioCard from './components/PortfolioCard'
import PriceChart from './components/PriceChart'
import SearchBar from './components/SearchBar'

const coinColors = ['#4f8f83', '#8b79b5', '#d58c70', '#c4a354', '#6686a3']


const App = () => {
   // Keeping dashboard controls in Redux so that all panels stay sync.
   const dispatch = useDispatch()
   const baseCurrency = useSelector(selectBaseCurrency)
   const chartType = useSelector(selectChartType)
   const range = useSelector(selectRange)
   const search = useSelector(selectSearch)
   const selectedCoinIds = useSelector(selectSelectedCoinIds)

   // Loading the market, selected-coin history, and rates for the chosen currency.
   const {
     currentData: marketData,
     isFetching:  isFetchingMarkets,
     isError: hasMarketError,
   } = useGetMarketDataQuery(baseCurrency.toLowerCase())

   const { currentData: historyData, isError: hasHistoryError } =
	useGetMarketHistoryQuery({
	  ids: selectedCoinIds,
	  currency: baseCurrency.toLowerCase(),
	  days: range,
    })

    const { currentData: exchangeRates, isError: hasExchangeRatesError } =
    useGetExchangeRatesQuery(baseCurrency.toLowerCase())

    const currencyRate =
    baseCurrency === 'USD'
      ? 1
      : exchangeRates?.rates?.USD
        ? 1 / exchangeRates.rates.USD
        : Number.NaN

    // Refreshing the most-used quotes periodically without waiting for market data.
  	const {
	    currentData: livePrices,
	    isFetching: isFetchingLivePrices,
	    isError: hasLivePriceError,
	  } = useGetSimplePricesQuery(
	    {
	      ids: ['bitcoin', 'ethereum', 'solana'],
	      currency: baseCurrency.toLowerCase(),
	    }
	  )

	// Prefer the fresher quote when available, while retaining market data as fallback.
    const marketCoins = marketData?.length ? marketData : []
    const coins = marketCoins.map((coin) => ({
      ...coin,
      current_price: livePrices?.[coin.id] ?? coin.current_price,
    }))

    const coinById =  Object.fromEntries(coins.map((coin) => [coin.id, coin]))

    const activeCoins = [] //selectedCoinIds.map((id) => coinById[id]).filter(Boolean)

    // Limit suggestions to five name/symbol matches to keep search results focused.
    const searchMatches = search.trim()
      ? coins
          .filter((coin) =>
            `${coin.name} ${coin.symbol}`
              .toLowerCase()
              .includes(search.trim().toLowerCase()),
          )
          .slice(0, 5)
      : []


    const chartLabels = historyData?.labels?.length ? historyData.labels : []

  // Building one chart series per selected coin, using a stable rotating color palette.
  const chartData = {
    labels: chartLabels,
    datasets: activeCoins.map((coin, index) => {
      const actualValues = historyData?.series?.[coin.id]
      const color = coinColors[index % coinColors.length]
      const values = actualValues?.length ? actualValues : []
      return {
        label: coin.name,
        data: values,
        borderColor: color,
        backgroundColor: chartType === 'bar' ? `${color}bb` : `${color}1a`,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointRadius: values.length > 24 ? 0 : 2,
        pointHoverRadius: 5,
        borderWidth: 2,
        tension: 0.32,
        fill: chartType === 'line' && index === 0,
      }
    }),
  }

  // Share currency-aware tooltip formatting and compact axis labels across chart types.
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
  
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#8290a5', maxTicksLimit: 7, maxRotation: 0 },
      },
      y: {
        beginAtZero: false,
        grid: { color: '#e7ece7', drawTicks: false },
        border: { display: false, dash: [4, 4] },
        ticks: {
          color: '#788a83',
          padding: 12,
          maxTicksLimit: 5,
          callback: (value) =>
            Number(value) >= 1000
              ? `${baseCurrency} ${(Number(value) / 1000).toFixed(1).replace(/\.0$/, '')}k`
              : `${baseCurrency} ${value}`,
        },
      },
    },
  }

  // Choosing a search result clears the query and focuses the chart on that coin.
  const chooseCoin = (coin) => {
    dispatch(setSearch(''));
    dispatch(setSelectedCoinIds([coin.id]));
  }

  // Ignore currency codes that are not offered by the dashboard.
  const handleCurrencyChange = (code) => {
    if (currencies.some(({ code: currencyCode }) => currencyCode === code)) {
      dispatch(setBaseCurrency(code));
    }
  }

  const apiError =
    hasMarketError ||
    hasHistoryError ||
    hasExchangeRatesError ||
    hasLivePriceError

  const apiErrorMessage =
    hasMarketError || hasHistoryError || hasLivePriceError
      ? 'Live CoinGecko data is temporarily unavailable.'
      : 'Live exchange rates are temporarily unavailable.'

  // Show the seven largest market caps in descending order.
  const displayedMarketCoins = [...coins]
    .sort((a, b) => (b.market_cap ?? 0) - (a.market_cap ?? 0))
    .slice(0, 7)

	return (
		<div> 
			<DashboardHeader />
			<main>
				<section>
					<SearchBar />
					<PriceChart />
					<div> 
						<PortfolioCard />
						<ExchangeCard />
					</div>
				</section>
				<MarketCapList />
			</main>
		</div>
	)
}

export default App