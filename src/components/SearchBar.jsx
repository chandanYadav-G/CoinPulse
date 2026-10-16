import { currencies } from '../constants/dashboard'
import { formatMoney } from '../utils/formatMoney'
import CoinIdentity from './CoinIdentity'
import StyledSelect from './StyledSelect'

export default function SearchBar({
  baseCurrency,
  search,
  searchMatches,
  onCurrencyChange,
  onSearchChange,
  onChooseCoin,
}) {
  return (
    // Pairing the currency selector with live coin suggestions and keyboard shortcuts.
    <div className='grid grid-cols-[89px_minmax(0,1fr)] gap-[15px] max-[600px]:grid-cols-[76px_minmax(0,1fr)] max-[600px]:gap-2'>
      <StyledSelect
        label='Base currency'
        className='h-[47px] max-[600px]:h-11'
        menuClassName='min-w-[220px]'
        value={baseCurrency}
        options={[
          {
            label: 'National currencies',
            options: currencies.map(({ code, name }) => ({
              value: code,
              label: `${code} · ${name}`,
            })),
          },
        ]}
        onChange={onCurrencyChange}
      />

      <div className='relative z-[4] flex h-[47px] min-w-0 items-center gap-[13px] rounded-[10px] border border-[#e0e8e0] bg-[#fffefa] px-[22px] shadow-[0_3px_12px_#344b3b0a] max-[600px]:h-11 max-[600px]:gap-2 max-[600px]:px-3'>
        
        <input
          className='h-full min-w-0 flex-1 border-0 bg-transparent text-[13px] text-[#293b34] outline-none placeholder:text-[#89988f]'
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && searchMatches[0])
              onChooseCoin(searchMatches[0]);
            if (event.key === 'Escape') onSearchChange('');
          }}
          placeholder='Search by coin'
          aria-label='Search cryptocurrencies'
          aria-expanded={searchMatches.length > 0}
        />
        {search && searchMatches.length === 0 && (
          <div className='absolute inset-x-0 top-[calc(100%+7px)] rounded-[10px] border border-[#e0e8e0] bg-[#fffefa] p-3.5 text-[13px] text-[#788a80] shadow-[0_12px_28px_#344b3b18]'>
            No matching cryptocurrencies
          </div>
        )}
        {searchMatches.length > 0 && (
          <div
            className='absolute inset-x-0 top-[calc(100%+7px)] rounded-[10px] border border-[#e0e8e0] bg-[#fffefa] p-[7px] shadow-[0_12px_28px_#344b3b18]'
            role='listbox'
          >
            {searchMatches.map((coin) => (
              <button
                className='flex w-full cursor-pointer items-center justify-between rounded-[7px] border-0 bg-transparent px-[10px] py-[9px] text-left text-[#3d4c44] hover:bg-[#f1f5f0]'
                type='button'
                key={coin.id}
                onClick={() => onChooseCoin(coin)}
              >
                <CoinIdentity coin={coin} />
                <span className='text-xs text-[#71847a]'>
                  {formatMoney(coin.current_price, baseCurrency)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
