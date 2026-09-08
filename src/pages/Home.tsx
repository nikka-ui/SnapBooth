import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { PrivacyNote } from '../components/ui/PrivacyNote'

type HomeProps = {
  onStart: () => void
}

export function Home({ onStart }: HomeProps) {
  return (
    <main className="booth-grain relative min-h-dvh overflow-hidden">
      <div className="booth-checker pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-between px-6 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="space-y-6 pt-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-booth-crimson">
            Online Photobooth
          </p>
          <h1 className="font-display text-6xl font-extrabold leading-[0.92] tracking-tight text-booth-ink sm:text-7xl">
            SNAP
            <span className="text-booth-crimson">BOOTH</span>
          </h1>
          <p className="max-w-sm text-lg leading-relaxed text-booth-ink/75">
            Turn moments into memories.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.45 }}
          className="space-y-5 pb-4"
        >
          <ol className="space-y-2 text-sm text-booth-ink/70">
            <li>1. Pick a frame</li>
            <li>2. Strike a pose with the countdown</li>
            <li>3. Download your strip</li>
          </ol>

          <Button onClick={onStart} className="w-full text-lg">
            Start Photobooth
          </Button>

          <PrivacyNote />
        </motion.div>
      </div>
    </main>
  )
}
