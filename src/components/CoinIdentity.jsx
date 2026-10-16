
const CoinIdentity = ({ coin }) => {
  return (
    <span className="inline-flex min-w-0 items-center gap-[9px]">
      {/* Use the coin's first symbol as a lightweight icon when no logo is shown. */}
      <span
        className="inline-grid h-[25px] w-[25px] flex-none place-items-center rounded-full text-[11px] font-bold uppercase text-white"
        style={{ backgroundColor: coin.color ?? "#71877c" }}
      >
        {coin.symbol.slice(0, 1).toUpperCase()}
      </span>
      <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium text-[#34443c]">
        {coin.name}
      </span>
    </span>
  )
}

export default CoinIdentity