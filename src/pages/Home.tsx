import { motion } from 'framer-motion'
import landingCollage from '../assets/landing-collage.png'
import { Button } from '../components/ui/Button'
import { PrivacyNote } from '../components/ui/PrivacyNote'

type HomeProps = {
  onStart: () => void
}

export function Home({ onStart }: HomeProps) {
  return (
    <main className="relative min-h-dvh overflow-hidden text-booth-ink">
      {/* Full-bleed pop-art collage — blurred so copy + CTA stay sharp */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <img
          src={landingCollage}
          alt=""
          className="h-full w-full scale-[1.15] object-cover blur-xl brightness-105 saturate-110 sm:blur-2xl"
        />
        <div className="absolute inset-0 bg-booth-cream/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-booth-cream/25 via-booth-cream/40 to-booth-cream/65" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgb(255_246_239_/0.45)_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-between px-6 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="space-y-6 pt-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-booth-crimson drop-shadow-sm">
            Online Photobooth
          </p>
          <h1 className="font-display text-6xl font-extrabold leading-[0.92] tracking-tight text-booth-ink drop-shadow-sm sm:text-7xl">
            SNAP
            <span className="text-booth-crimson">BOOTH</span>
          </h1>
          <p className="max-w-sm text-lg leading-relaxed text-booth-ink/80">
            Turn moments into memories.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.45 }}
          className="space-y-5 pb-4"
        >
          <ol className="space-y-2 text-sm text-booth-ink/75">
            <li>1. Pick a frame</li>
            <li>2. Strike a pose with the countdown</li>
            <li>3. Download your strip</li>
          </ol>

          <Button
            onClick={onStart}
            className="w-full text-lg shadow-[0_16px_40px_rgb(180_35_24_/0.35)]"
          >
            Start Photobooth
          </Button>

          <PrivacyNote className="text-booth-ink/65" />
        </motion.div>
      </div>
    </main>
  )
}
