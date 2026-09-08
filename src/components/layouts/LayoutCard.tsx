import type { LayoutConfig } from '../../types/photobooth'

type LayoutCardProps = {
  layout: LayoutConfig
  selected: boolean
  onSelect: (layoutId: string) => void
}

export function LayoutCard({ layout, selected, onSelect }: LayoutCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(layout.id)}
      aria-pressed={selected}
      className={[
        'group w-full overflow-hidden rounded-3xl text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-booth-crimson',
        selected
          ? 'bg-white shadow-[0_18px_40px_rgb(180_35_24_/0.18)] ring-2 ring-booth-crimson'
          : 'bg-white/75 ring-1 ring-booth-ink/8 hover:bg-white hover:shadow-lg',
      ].join(' ')}
    >
      <div className="aspect-[2/3] overflow-hidden bg-booth-blush/60">
        <img
          src={layout.thumbnailSrc ?? layout.frameSrc}
          alt={`${layout.name} frame preview`}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="space-y-1 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-xl font-bold tracking-tight">{layout.name}</h3>
          <span className="rounded-full bg-booth-ink/5 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-booth-ink/70">
            {layout.slots.length} photos
          </span>
        </div>
        <p className="text-sm text-booth-ink/65">{layout.description}</p>
      </div>
    </button>
  )
}
