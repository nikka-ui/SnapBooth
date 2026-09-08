import type { RefObject } from 'react'
import type { FacingMode } from '../../hooks/useCamera'

type CameraPreviewProps = {
  videoRef: RefObject<HTMLVideoElement | null>
  facingMode: FacingMode
  isReady: boolean
}

export function CameraPreview({ videoRef, facingMode, isReady }: CameraPreviewProps) {
  const mirrored = facingMode === 'user'

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] bg-booth-ink shadow-[0_24px_60px_rgb(26_18_16_/0.35)] ring-1 ring-white/20">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={[
          'h-full w-full object-cover',
          mirrored ? '-scale-x-100' : '',
          isReady ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-booth-ink text-booth-cream">
          <p className="animate-pulse text-sm font-medium tracking-wide">Warming up the camera…</p>
        </div>
      )}
    </div>
  )
}
