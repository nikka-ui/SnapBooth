type SessionProgressProps = {
  current: number
  total: number
}

export function SessionProgress({ current, total }: SessionProgressProps) {
  const safeCurrent = Math.min(current, total)

  return (
    <div className="rounded-full bg-booth-ink/80 px-4 py-2 text-center text-sm font-semibold tracking-wide text-booth-cream backdrop-blur">
      PHOTO {safeCurrent} OF {total}
    </div>
  )
}
