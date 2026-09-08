import { motion } from 'framer-motion'
import { LayoutCard } from '../components/layouts/LayoutCard'
import { Button } from '../components/ui/Button'
import { layouts } from '../data/layouts'

type LayoutSelectionProps = {
  selectedLayoutId: string | null
  onSelect: (layoutId: string) => void
  onContinue: () => void
  onBack: () => void
}

export function LayoutSelection({
  selectedLayoutId,
  onSelect,
  onContinue,
  onBack,
}: LayoutSelectionProps) {
  return (
    <main className="booth-grain min-h-dvh px-6 py-8">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
        <header className="space-y-2">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-semibold text-booth-ink/60 hover:text-booth-ink"
          >
            ← Back
          </button>
          <h1 className="font-display text-4xl font-extrabold tracking-tight">Select your frame</h1>
          <p className="text-booth-ink/70">
            More frames can be added later — start with Retro Classic.
          </p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4"
        >
          {layouts.map((layout) => (
            <LayoutCard
              key={layout.id}
              layout={layout}
              selected={selectedLayoutId === layout.id}
              onSelect={onSelect}
            />
          ))}
        </motion.div>

        <Button onClick={onContinue} disabled={!selectedLayoutId} className="w-full">
          Continue to Camera
        </Button>
      </div>
    </main>
  )
}
