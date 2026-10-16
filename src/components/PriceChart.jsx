import { useState } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import CoinIdentity from './CoinIdentity'
import StyledSelect from './StyledSelect'

ChartJS.register(
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
)

const ranges = [
  { label: '1D', days: '1' },
  { label: '1W', days: '7' },
  { label: '1M', days: '30' },
  { label: '6M', days: '180' },
  { label: '1Y', days: '365' },
]

const coinColors = ['#4f8f83', '#8b79b5', '#d58c70', '#c4a354', '#6686a3']

const PriceChart = ({
  activeCoins,
  baseCurrency,
  chartData,
  chartOptions,
  chartType,
  coins,
  range,
  selectedCoinIds,
  onChartTypeChange,
  onRangeChange,
  onSelectedCoinsChange,
}) => {
  const [coinPickerOpen, setCoinPickerOpen] = useState(false)

  return (
    // Controls update the shared chart range, series selection, and visualization.
    <section
      className='flex min-h-[292px] min-w-0 flex-col rounded-[10px] border border-[#e0e8e0] bg-[#fffefa] px-[37px] py-[15px] shadow-[0_3px_12px_#344b3b0a] max-[1100px]:px-5 max-[600px]:min-h-[345px] max-[600px]:px-[11px] max-[600px]:pb-[14px] max-[600px]:pt-[11px]'
      aria-label='Cryptocurrency price chart'
    >
      <div className='flex min-h-10 items-center justify-end gap-10 max-[1100px]:justify-between max-[1100px]:gap-3 max-[600px]:items-stretch max-[600px]:flex-col max-[600px]:gap-[9px]'>
        
        <div className='flex items-center gap-1 max-[600px]:w-full max-[600px]:justify-between max-[600px]:gap-[3px]' aria-label='Chart date range'>
          {ranges.map(({ label, days }) => (
            <button
              className={`h-8 min-w-[42px] cursor-pointer rounded-[9px] border px-[11px] text-[11px] font-semibold transition-colors max-[1100px]:min-w-[35px] max-[1100px]:px-2 max-[600px]:h-[30px] max-[600px]:min-w-0 max-[600px]:flex-1 max-[600px]:px-[5px] ${
                range === days
                  ? 'border-[#7fa99d] bg-[#e4efea] text-[#356b5e]'
                  : 'border-transparent bg-[#f2f5f0] text-[#46564e]'
              }`}
              type='button'
              key={days}
              aria-pressed={range === days}
              onClick={() => onRangeChange(days)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className='flex items-center gap-[14px] max-[1100px]:gap-2 max-[600px]:w-full max-[600px]:justify-between'>
          <div className='relative z-[3] max-[600px]:min-w-0 max-[600px]:flex-1'>
            <button
              className='relative flex h-10 min-w-[142px] cursor-pointer items-center rounded-[9px] border border-[#e0e8e0] bg-[#fffefa] pl-[14px] pr-[31px] text-left text-[11px] font-semibold text-[#3d4c44] shadow-[0_3px_12px_#344b3b0a] max-[1100px]:min-w-[115px] max-[600px]:w-full max-[600px]:min-w-0'
              type='button'
              aria-expanded={coinPickerOpen}
              onClick={() => setCoinPickerOpen((open) => !open)}
            >
              <span className='truncate'>
                {activeCoins.length === 1
                  ? activeCoins[0].name
                  : `${activeCoins.length} Cryptocurrencies`}
              </span>
              
            </button>
            {coinPickerOpen && (
              <div className='absolute right-0 top-[calc(100%+7px)] max-h-[300px] w-[230px] overflow-y-auto rounded-[10px] border border-[#e0e8e0] bg-[#fffefa] p-1.5 shadow-[0_12px_28px_#344b3b18]'>
                {coins.slice(0, 12).map((coin) => (
                  <label
                    className='flex cursor-pointer items-center gap-[9px] rounded-[7px] p-2 text-xs text-[#46564e] hover:bg-[#f1f5f0]'
                    key={coin.id}
                  >
                    <input
                      className='accent-[#527f70]'
                      type='checkbox'
                      checked={selectedCoinIds.includes(coin.id)}
                      onChange={(event) => {
                        // Keep at most five series and never leave the chart empty.
                        const nextIds = event.target.checked
                          ? [...selectedCoinIds, coin.id].slice(-5)
                          : selectedCoinIds.filter((id) => id !== coin.id);
                        onSelectedCoinsChange(
                          nextIds.length
                            ? nextIds
                            : [
                                coins.find(
                                  (candidate) => candidate.id !== coin.id,
                                )?.id ?? coin.id,
                              ],
                        );
                      }}
                    />
                    <CoinIdentity coin={coin} />
                  </label>
                ))}
              </div>
            )}
          </div>
          <StyledSelect
            label='Chart type'
            className='h-10 min-w-[118px] max-[1100px]:min-w-[115px] max-[600px]:min-w-0 max-[600px]:flex-1'
            value={chartType}
            options={[
              {
                label: 'Chart type',
                options: [
                  { value: 'line', label: 'Line chart' },
                  { value: 'bar', label: 'Bar chart' },
                ],
              },
            ]}
            onChange={onChartTypeChange}
          />
        </div>
      </div>

      <div className='flex min-h-[38px] items-center justify-between px-px pt-1 max-[600px]:min-h-[42px]'>
        <span className='text-[11px] font-semibold text-[#3d4c44]'>
          {baseCurrency}
        </span>
        <div className='flex flex-wrap justify-end gap-[13px] max-[600px]:gap-[7px]'>
          {activeCoins.map((coin, index) => (
            <span
              className='inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] text-[#46564e] max-[600px]:text-[10px]'
              key={coin.id}
            >
              <i
                className='inline-block h-[9px] w-[9px] flex-none rounded-full'
                style={{ backgroundColor: coinColors[index % coinColors.length] }}
              />
              {coin.name}
            </span>
          ))}
        </div>
      </div>
      <div className='relative min-h-[185px] flex-1 max-[600px]:min-h-[205px]'>
        {chartType === 'bar' ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>
    </section>
  )
}

export default PriceChart