import { formatMoney } from '../utils/formatMoney'
import CoinIdentity from './CoinIdentity'

const MarketCapList = ({
  coins,
  baseCurrency,
  isFetching,
  selectedCoinIds,
  onSelectCoin,
}) => {
  return (
    // Each row selects a coin for the chart and indicates its 24-hour movement.
    <aside className='flex h-[600px] min-h-0 flex-col self-start overflow-hidden rounded-[10px] border border-[#e0e8e0] bg-[#fffefa] shadow-[0_3px_12px_#344b3b0a] max-[850px]:h-[586px] max-[600px]:h-[500px]'>
      <div className='flex min-h-[86px] items-start justify-between px-[22px] pb-[14px] pt-[22px]'>
        <h1 className='m-0 text-[15px] font-semibold text-[#293b34]'>
          Cryptocurrency by
          <br />
          market cap
        </h1>
        
      </div>
      <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain'>
        {coins.map((coin) => {
          const change = coin.price_change_percentage_24h ?? 0

          return (
            <button
              className={`grid min-h-[67px] shrink-0 w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] grid-rows-2 content-center items-center border-0 border-t border-solid border-t-[#eaf0e9] bg-[#fffefa] px-[22px] text-left hover:bg-[#f4f7f2] first:border-t-transparent max-[850px]:even:border-l max-[850px]:even:border-l-[#eaf0e9] max-[850px]:[&:nth-child(2)]:border-t-transparent max-[380px]:border-l-0 max-[380px]:[&:nth-child(2)]:border-t-[#eaf0e9]`}
              type='button'
              key={coin.id}
              onClick={() => onSelectCoin(coin)}
              aria-pressed={selectedCoinIds.includes(coin.id)}
            >
              <span className='col-start-1 row-start-1'>
                <CoinIdentity coin={coin} />
              </span>
              <span className='col-start-1 row-start-2 mt-px pl-[34px] text-[11px] text-[#829087]'>
                {formatMoney(coin.market_cap, baseCurrency, {
                  notation: 'compact',
                  maximumSignificantDigits: 3,
                })}
              </span>
              <span
                className={`col-start-2 row-span-2 inline-flex items-center gap-1 whitespace-nowrap text-[10px] font-semibold ${
                  change < 0 ? 'text-[#c47b63]' : 'text-[#538b72]'
                }`}
              >
                <span aria-hidden='true'>{change < 0 ? '▼' : '▲'}</span>
                {Math.abs(change).toFixed(2)}%
              </span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

export default MarketCapList
