import { useState } from 'react'
import { currencies, fallbackExchangeRates } from '../constants/dashboard'
import StyledSelect from './StyledSelect'

const ExchangeCard = ({
  baseCurrency,
  coins,
  coinById,
  exchangeRates,
}) => {
  const [exchangeFrom, setExchangeFrom] = useState('bitcoin')
  const [exchangeTo, setExchangeTo] = useState('ethereum')
  const [amount, setAmount] = useState('')
  const [amountError, setAmountError] = useState('')
  const [exchangeMessage, setExchangeMessage] = useState('')

  // Converting each selection to its value in the active base currency.
  const getChoice = (id) => currencies.find(({ code }) => code === id)
  const getCoinPrice = (id) => {
    if (getChoice(id)) {
      const rate = exchangeRates?.rates?.[id]
      if (rate) return 1 / rate
      const baseRate = fallbackExchangeRates[baseCurrency]
      const choiceRate = fallbackExchangeRates[id]
      return baseRate && choiceRate ? baseRate / choiceRate : null
    }
    const coin = coinById[id]
    return coin?.current_price ?? null
  }

  const exchangeLabel = (id) => {
    const currency = currencies.find((entry) => entry.code === id);
    if (currency) return currency.code;
    return coinById[id]?.symbol?.toUpperCase() ?? id;
  }

  const convert = () => {
    // Rejecting malformed or non-positive amounts before calculating an estimate.
    if (!amount.trim() || !/^\d+(\.\d+)?$/.test(amount) || Number(amount) <= 0) {
      setAmountError('Enter a valid number greater than zero.')
      setExchangeMessage('')
      return
    }

    const fromPrice = getCoinPrice(exchangeFrom)
    const toPrice = getCoinPrice(exchangeTo)
    if (!fromPrice || !toPrice) {
      setAmountError('A conversion rate is not available for this selection.')
      setExchangeMessage('')
      return
    }
    const result = (Number(amount) * fromPrice) / toPrice
    const toCoin = coinById[exchangeTo];
    const label =
      getChoice(exchangeTo)?.code ?? toCoin?.symbol?.toUpperCase() ?? exchangeTo;
    setAmountError('')
    setExchangeMessage(
      `${Number(amount).toLocaleString()} ${exchangeLabel(exchangeFrom)} ≈ ${result.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${label}`,
    )
  }

  const updateAmount = (value) => {
    setAmount(value)
    setExchangeMessage('')
    if (value && !/^\d*\.?\d*$/.test(value)) {
      setAmountError('Please enter numbers only.')
    } else {
      setAmountError('')
    }
  }

  return (
    <section className='min-h-[224px] min-w-0 rounded-[10px] border border-[#e0e8e0] bg-[#fffefa] px-[23px] py-[15px] shadow-[0_3px_12px_#344b3b0a] max-[1100px]:px-4 max-[600px]:min-h-[205px] max-[600px]:px-[18px]'>
      <h2 className='m-0 text-[15px] font-semibold tracking-[-0.15px] text-[#293b34]'>
        Exchange Coins
      </h2>
      <div className='mt-[22px] grid grid-cols-[28px_minmax(100px,1fr)_minmax(90px,0.85fr)] items-center gap-x-[9px] gap-y-[10px] max-[600px]:grid-cols-[28px_minmax(80px,1fr)_minmax(80px,0.85fr)]'>
        <span className='text-[11px] font-semibold text-[#bd795f]'>Sell</span>
        <CurrencySelect
          label='Currency to sell'
          value={exchangeFrom}
          coins={coins}
          onChange={(value) => {
            setExchangeFrom(value)
            setExchangeMessage('')
          }}
        />
        <label className={`relative flex h-[39px] min-w-0 items-center rounded-[9px] border px-[10px] focus-within:border-[#91b4a5] ${amountError ? 'border-[#d78b7c]' : 'border-[#e3eae2]'}`}>
          <span className='sr-only'>Amount to convert</span>
          <input
            className='h-full w-full min-w-0 border-0 bg-transparent p-0 text-[11px] text-[#3d4c44] outline-none placeholder:text-[#89988f]'
            value={amount}
            onChange={(event) => updateAmount(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') convert()
            }}
            inputMode='decimal'
            placeholder='Enter amount'
            aria-invalid={Boolean(amountError)}
            aria-describedby={amountError ? 'amount-error' : undefined}
          />
        </label>
        <span className='text-[11px] font-semibold text-[#548a72]'>Buy</span>
        <CurrencySelect
          label='Currency to buy'
          value={exchangeTo}
          coins={coins}
          onChange={(value) => {
            setExchangeTo(value)
            setExchangeMessage('')
          }}
        />
        <span
          className='col-start-3 overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#548a72]'
          aria-live='polite'
        >
          {exchangeMessage || 'Conversion estimate'}
        </span>
      </div>
      {amountError && (
        <p
          className='mb-0 ml-[37px] mt-1.5 text-[10px] leading-[1.35] text-[#b65d53]'
          id='amount-error'
          role='alert'
        >
          {amountError}
        </p>
      )}
      {exchangeMessage && (
        <p
          className='mb-0 ml-[37px] mt-1.5 text-[10px] leading-[1.35] text-[#548a72]'
          role='status'
        >
          {exchangeMessage}
        </p>
      )}
      <button
        className='mx-auto mt-4 block h-[39px] min-w-[103px] cursor-pointer rounded-[9px] border-0 bg-[#527f70] px-[19px] text-xs font-semibold text-white transition active:translate-y-px hover:bg-[#3f6b5d]'
        type='button'
        onClick={convert}
      >
        Convert
      </button>
    </section>
  );
}

function CurrencySelect({ label, value, coins, onChange }) {
  return (
    // Group asset and fiat options so users can convert across both categories.
    <StyledSelect
      label={label}
      className='h-[39px]'
      menuClassName='min-w-[230px]'
      value={value}
      options={[
        {
          label: 'Cryptocurrencies',
          options: coins.map((coin) => ({
            value: coin.id,
            label: `${coin.name} · ${coin.symbol.toUpperCase()}`,
          })),
        },
        {
          label: 'National currencies',
          options: currencies.map(({ code, name }) => ({
            value: code,
            label: `${code} · ${name}`,
          })),
        },
      ]}
      onChange={onChange}
    />
  )
}

export default ExchangeCard