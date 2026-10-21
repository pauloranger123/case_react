
import { useState } from 'react'

type PriceRangeProps = {
  min: string
  max: string
  onMinChange: (value: string) => void
  onMaxChange: (value: string) => void
}

export default function PriceRange({
  min,
  max,
  onMinChange,
  onMaxChange,
}: PriceRangeProps) {
  const [activeThumb, setActiveThumb] = useState<'min' | 'max'>('max')

  const minValue = Number(min)
  const maxValue = Number(max)
  const limit = 20

  const left = (minValue / limit) * 100
  const right = (maxValue / limit) * 100

  return (
    <div className="w-full pt-2">
      <div className="relative h-6">
        <div className="absolute top-1/2 h-[5px] w-full -translate-y-1/2 rounded-full bg-[#493024]" />

        <div
          className="absolute top-1/2 h-[5px] -translate-y-1/2 rounded-full bg-[#D99045]"
          style={{
            left: `${left}%`,
            width: `${Math.max(0, right - left)}%`,
          }}
        />

        <input
          type="range"
          min="0"
          max={limit}
          step="0.01"
          value={minValue}
          aria-label="Preço mínimo"
          onFocus={() => setActiveThumb('min')}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxValue)
            onMinChange(value.toFixed(2))
          }}
          className={`price-thumb absolute inset-0 z-20 h-6 w-full ${
            activeThumb === 'min' ? 'active-thumb' : ''
          }`}
          style={{ pointerEvents: 'none' }}
        />

        <input
          type="range"
          min="0"
          max={limit}
          step="0.01"
          value={maxValue}
          aria-label="Preço máximo"
          onFocus={() => setActiveThumb('max')}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minValue)
            onMaxChange(value.toFixed(2))
          }}
          className={`price-thumb absolute inset-0 z-10 h-6 w-full ${
            activeThumb === 'max' ? 'active-thumb' : ''
          }`}
          style={{ pointerEvents: 'none' }}
        />
      </div>

      <div className="mt-2 flex justify-between text-[10px] text-[#C9B6A2]">
        <span>{minValue.toFixed(2)} ETH</span>
        <span>{maxValue.toFixed(2)} ETH</span>
      </div>
    </div>
  )
}
