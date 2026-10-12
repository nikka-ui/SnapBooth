import type { FacingMode } from '../../hooks/useCamera'

type CameraControlsProps = {
  canSwitch: boolean
  facingMode: FacingMode
  onSelect: (facingMode: FacingMode) => void
  disabled?: boolean
}

const options: { value: FacingMode; label: string }[] = [
  { value: 'user', label: 'Front Cam' },
  { value: 'environment', label: 'Back Cam' },
]

export function CameraControls({ canSwitch, facingMode, onSelect, disabled }: CameraControlsProps) {
  if (!canSwitch) return null

  return (
    <div
      role="radiogroup"
      aria-label="Choose camera"
      className="grid grid-cols-2 gap-1 rounded-2xl bg-white/10 p-1 ring-1 ring-white/15"
    >
      {options.map((option) => {
        const selected = facingMode === option.value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onSelect(option.value)}
            className={[
              'min-h-11 rounded-xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
              selected
                ? 'bg-booth-cream text-booth-ink shadow'
                : 'text-booth-cream/75 hover:bg-white/10 hover:text-booth-cream',
            ].join(' ')}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
