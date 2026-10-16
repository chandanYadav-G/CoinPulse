const DashboardHeader = () => {
  return (
    <header
      className='relative z-[5] flex h-[77px] items-center bg-[#fffefa] px-[max(calc((100vw-1150px)/2),32px)] shadow-[0_2px_5px_#344b3b12]'
    >
      <a href="/" 
        className='inline-flex items-center gap-2.5 text-[21px] font-bold text-[#293b34] no-underline'
      >
        <span>CoinPulse</span>
      </a>
    </header>
  )
}

export default DashboardHeader