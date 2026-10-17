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

    const activeCoins = selectedCoinIds.map((id) => coinById[id]).filter(Boolean)

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

  // Ignoring currency codes that are not offered by the dashboard.
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

  // Showing all the largest market caps in descending order.
  const displayedMarketCoins = [...coins]
    .sort((a, b) => (b.market_cap ?? 0) - (a.market_cap ?? 0))
    
return (
  <div className="min-h-screen bg-[#f1f5f0]">
    <DashboardHeader />

    <main className="mx-auto w-[calc(100%-64px)] max-w-[1420px] py-[30px] max-[600px]:w-[calc(100%-24px)] max-[600px]:py-4">
      <div
        className="
          grid grid-cols-[minmax(0,2.75fr)_minmax(280px,1fr)]
          items-stretch gap-[20px]
          max-[850px]:grid-cols-1
          max-[850px]:gap-4
        "
      >
        {/* Left column: search, chart, and bottom cards */}
        <div className="grid min-w-0 grid-cols-2 content-start gap-[18px] max-[600px]:grid-cols-1">
          {/* Search spans both columns */}
          <div className="col-span-2 min-w-0 max-[600px]:col-span-1">
            <SearchBar
              baseCurrency={baseCurrency}
              search={search}
              searchMatches={searchMatches}
              onCurrencyChange={handleCurrencyChange}
              onSearchChange={(value) => dispatch(setSearch(value))}
              onChooseCoin={chooseCoin}
            />
          </div>

          {/*Showing error msg if the api response fails*/}
          {apiError && (
            <div
              className="rounded-lg border border-[#e5d6b7] bg-[#fbf6e9] px-3 py-[9px] text-[11px] leading-[1.4] text-[#806b3e]"
              role="status"
            >
              {apiErrorMessage}
            </div>
          )}

          {/* Price chart spans both columns */}
          <div className="col-span-2 min-w-0 max-[600px]:col-span-1">
            <PriceChart
              activeCoins={activeCoins}
              baseCurrency={baseCurrency}
              chartData={chartData}
              chartOptions={chartOptions}
              chartType={chartType}
              coins={coins}
              range={range}
              selectedCoinIds={selectedCoinIds}
              onChartTypeChange={(type) =>
                dispatch(setChartType(type))
              }
              onRangeChange={(days) => dispatch(setRange(days))}
              onSelectedCoinsChange={(ids) =>
                dispatch(setSelectedCoinIds(ids))
              }
            />
          </div>

          {/* Bottom-left card */}
          <div className="min-w-0">
            <PortfolioCard
              baseCurrency={baseCurrency}
              currencyRate={currencyRate}
            />
          </div>

          {/* Bottom-right card */}
          <div className="min-w-0">
            <ExchangeCard
              baseCurrency={baseCurrency}
              coins={coins}
              coinById={coinById}
              exchangeRates={exchangeRates}
            />
          </div>
        </div>

        {/* Right column: market cap list */}
        <div className="min-w-0 max-[850px]:row-start-2">
          <MarketCapList
            coins={displayedMarketCoins}
            baseCurrency={baseCurrency}
            isFetching={isFetchingMarkets || isFetchingLivePrices}
            selectedCoinIds={selectedCoinIds}
            onSelectCoin={(coin) =>
              dispatch(setSelectedCoinIds([coin.id]))
            }
          />
        </div>
      </div>
    </main>
  </div>
)

}

export default App