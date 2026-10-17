import { Doughnut } from 'react-chartjs-2'
import { ArcElement, Chart as ChartJS, Tooltip } from 'chart.js'
import { formatMoney } from '../utils/formatMoney'

ChartJS.register(ArcElement, Tooltip)

const portfolioValues = [375, 375, 250]
const portfolioColors = ['#4f8f83', '#d58c70', '#8b79b5']
const portfolioLabels = ['Bitcoin', 'Solana', 'Ethereum']

// Keeping the chart and legend backed by the same sample portfolio allocation.
const portfolioData = {
  labels: portfolioLabels,
  datasets: [
    {
      data: portfolioValues,
      backgroundColor: portfolioColors,
      borderColor: '#fffefa',
      borderWidth: 0,
      hoverOffset: 5,
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '0%',
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
}

const PortfolioCard = ({ baseCurrency, currencyRate }) => {
  const portfolioTotal = portfolioValues.reduce((sum, value) => sum + value, 0)

  return (
    <section className='min-h-[224px] min-w-0 rounded-[10px] border border-[#e0e8e0] bg-[#fffefa] px-7 py-[15px] shadow-[0_3px_12px_#344b3b0a] max-[1100px]:px-4 max-[600px]:min-h-[205px] max-[600px]:px-[18px]'>
      <div className='flex items-center justify-between gap-2'>
        <h2 className='m-0 text-[15px] font-semibold tracking-[-0.15px] text-[#293b34]'>
          Portfolio
        </h2>
        <span className='whitespace-nowrap text-xs text-[#87958d]'>
          <span>Total value</span>{' '}
          <strong className='text-[13px] text-[#293b34]'>
            {formatMoney(portfolioTotal * currencyRate, baseCurrency)}
          </strong>
        </span>
      </div>
      <div className='flex h-[157px] items-center justify-center gap-[39px] max-[1100px]:gap-5 max-[600px]:gap-7'>
        <div className='relative h-[140px] w-[140px] flex-none max-[1100px]:h-[125px] max-[1100px]:w-[125px] max-[600px]:h-[135px] max-[600px]:w-[135px]'>
          <Doughnut data={portfolioData} options={chartOptions} />
          <span className='pointer-events-none absolute right-[5%] top-[39%] z-[1] text-[10px] font-semibold text-white'>
            {formatMoney(375 * currencyRate, baseCurrency)}
          </span>
          <span className='pointer-events-none absolute bottom-[17%] left-[27%] z-[1] text-[10px] font-semibold text-white'>
            {formatMoney(375 * currencyRate, baseCurrency)}
          </span>
          <span className='pointer-events-none absolute left-[17%] top-[28%] z-[1] text-[10px] font-semibold text-white'>
            {formatMoney(250 * currencyRate, baseCurrency)}
          </span>
        </div>
        <div className='flex flex-col gap-[11px]'>
          {portfolioLabels.map((label, index) => (
            <span
              className='flex items-center gap-2 whitespace-nowrap text-xs text-[#46564e]'
              key={label}
            >
              <i
                className='inline-block h-[9px] w-[9px] flex-none rounded-full'
                style={{ backgroundColor: portfolioColors[index] }}
              />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PortfolioCard