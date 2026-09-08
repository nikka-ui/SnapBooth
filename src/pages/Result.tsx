import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { PrivacyNote } from '../components/ui/PrivacyNote'
import { downloadBlob, shareImageBlob } from '../utils/download'

type ResultProps = {
  imageUrl: string | null
  errorMessage?: string
  onRetake: () => void
  onHome: () => void
}

export function Result({ imageUrl, errorMessage, onRetake, onHome }: ResultProps) {
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const canShare = useMemo(() => typeof navigator !== 'undefined' && !!navigator.share, [])

  const handleDownload = async () => {
    if (!imageUrl) return
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      downloadBlob(blob, `snapbooth-${Date.now()}.png`)
      setStatusMessage(null)
    } catch {
      setStatusMessage('Download failed. Try again or use Share if available.')
    }
  }

  const handleShare = async () => {
    if (!imageUrl) return
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const result = await shareImageBlob(blob, `snapbooth-${Date.now()}.png`)
      if (result === 'unsupported') {
        setStatusMessage('Sharing is not supported on this device. Use Download instead.')
      }
    } catch {
      setStatusMessage('Sharing failed. You can still download your photo.')
    }
  }

  return (
    <main className="booth-grain min-h-dvh px-6 py-8">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
        <header className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-booth-crimson">
            SnapBooth
          </p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight">
            Your memories are ready! 📸
          </h1>
        </header>

        {imageUrl ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="overflow-hidden rounded-[1.75rem] bg-white p-3 shadow-[0_24px_50px_rgb(26_18_16_/0.16)]"
          >
            <img
              src={imageUrl}
              alt="Finished SnapBooth photobooth strip"
              className="mx-auto max-h-[60vh] w-full object-contain"
            />
          </motion.div>
        ) : (
          <div className="rounded-3xl bg-white/80 p-6 text-center text-booth-ink/70 ring-1 ring-booth-ink/10">
            {errorMessage ?? 'Your image is not ready yet.'}
          </div>
        )}

        <div className="grid gap-3">
          <Button onClick={() => void handleDownload()} disabled={!imageUrl} className="w-full text-lg">
            Download Photo
          </Button>
          {canShare && (
            <Button
              variant="secondary"
              onClick={() => void handleShare()}
              disabled={!imageUrl}
              className="w-full"
            >
              Share
            </Button>
          )}
          <Button variant="ghost" onClick={onRetake} className="w-full">
            Take Again
          </Button>
          <button
            type="button"
            onClick={onHome}
            className="text-sm font-semibold text-booth-ink/60 hover:text-booth-ink"
          >
            Back to Home
          </button>
        </div>

        {statusMessage && (
          <p className="rounded-2xl bg-booth-crimson/10 px-4 py-3 text-sm text-booth-crimson-deep">
            {statusMessage}
          </p>
        )}

        <PrivacyNote className="text-center" />
      </div>
    </main>
  )
}
