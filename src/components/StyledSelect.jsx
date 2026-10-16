import { useEffect, useId, useRef, useState } from 'react'

const StyledSelect = ({
  label,
  value,
  options,
  onChange,
  className = '',
  menuClassName = '',
}) => {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const listId = useId()
  const selectedOption = options
    .flatMap((group) => group.options)
    .find((option) => option.value === value)

  useEffect(() => {
    if (!open) return undefined

    // Close the menu when the pointer interaction happens outside this control.
    const closeOnOutsidePointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer)
    return () =>
      document.removeEventListener('pointerdown', closeOnOutsidePointer)
  }, [open])

  const close = (restoreFocus = false) => {
    setOpen(false)
    if (restoreFocus) triggerRef.current?.focus()
  }

  return (
    // Custom listbox keeps the compact dashboard styling and keyboard focus behavior.
    <div className={`relative min-w-0 ${className}`} ref={rootRef}>
      <button
        ref={triggerRef}
        className='relative flex h-full w-full min-w-0 items-center justify-between gap-2 rounded-[9px] border border-[#e0e8e0] bg-[#fffefa] px-[14px] pr-9 text-left text-[11px] font-semibold text-[#3d4c44] shadow-[0_3px_12px_#344b3b0a] outline-none transition-colors hover:bg-[#f8faf6] focus-visible:border-[#91b4a5] focus-visible:ring-2 focus-visible:ring-[#dceae2]'
        type='button'
        aria-label={label}
        aria-haspopup='listbox'
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && open) close(true)
        }}
      >
        <span className='min-w-0 truncate'>
          {selectedOption?.label ?? value}
        </span>
      
      </button>
      {open && (
        <div
          className={`absolute left-0 top-[calc(100%+7px)] z-20 max-h-[300px] min-w-full overflow-y-auto rounded-[10px] border border-[#e0e8e0] bg-[#fffefa] p-1.5 shadow-[0_12px_28px_#344b3b18] ${menuClassName}`}
          id={listId}
          role='listbox'
          aria-label={label}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault()
              close(true)
            }
          }}
        >
          {options.map((group) => (
            <div key={group.label}>
              {group.label && (
                <div className='px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#829087]'>
                  {group.label}
                </div>
              )}
              {group.options.map((option) => (
                <button
                  className={`flex min-h-9 w-full cursor-pointer items-center justify-between gap-3 rounded-[7px] border-0 px-2.5 py-2 text-left text-xs transition-colors hover:bg-[#f1f5f0] focus-visible:bg-[#e8f0e9] focus-visible:outline-none ${
                    option.value === value
                      ? 'bg-[#eaf2ec] font-semibold text-[#356b5e]'
                      : 'bg-transparent text-[#46564e]'
                  }`}
                  type='button'
                  role='option'
                  aria-selected={option.value === value}
                  key={option.value}
                  onClick={() => {
                    onChange(option.value)
                    close(true)
                  }}
                >
                  <span className='min-w-0 truncate'>{option.label}</span>
                  {option.value === value && (
                    <span className='flex-none text-[#548a72]' aria-hidden='true'>
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


export default StyledSelect