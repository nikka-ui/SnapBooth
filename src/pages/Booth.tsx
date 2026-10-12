import { useCallback, useEffect } from 'react'
import { CameraControls } from '../components/camera/CameraControls'
import { CameraPreview } from '../components/camera/CameraPreview'
import { CaptureFlash } from '../components/photobooth/CaptureFlash'
import { CountdownOverlay } from '../components/photobooth/CountdownOverlay'
import { SessionProgress } from '../components/photobooth/SessionProgress'
import { Button } from '../components/ui/Button'
import { useCamera } from '../hooks/useCamera'
import type { LayoutConfig, PhotoSession } from '../types/photobooth'

type BoothProps = {
  session: PhotoSession
  layout: LayoutConfig
  onBack: () => void
  onBeginCountdown: (onCapture: () => void) => void
  onCapture: (video: HTMLVideoElement, mirror: boolean) => void
  onComplete: () => void
}

export function Booth({
  session,
  layout,
  onBack,
  onBeginCountdown,
  onCapture,
  onComplete,
}: BoothProps) {
  const { videoRef, facingMode, isReady, isSwitching, canSwitch, error, selectCamera, retry, stop } =
    useCamera(true)

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  useEffect(() => {
    if (session.status === 'complete' && session.composedImageUrl) {
      onComplete()
    }
  }, [onComplete, session.composedImageUrl, session.status])

  const runCapture = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    onCapture(video, facingMode === 'user')
  }, [facingMode, onCapture, videoRef])

  const startPose = useCallback(() => {
    onBeginCountdown(runCapture)
  }, [onBeginCountdown, runCapture])

  const displayIndex = Math.min(session.currentPhotoIndex + 1, layout.slots.length)
  const lastPhoto = session.capturedPhotos[session.capturedPhotos.length - 1]
  const busy =
    session.status === 'countdown' ||
    session.status === 'capturing' ||
    session.status === 'reviewing' ||
    session.status === 'composing'

  return (
    <main className="min-h-dvh bg-booth-ink text-booth-cream">
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 py-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-semibold text-booth-cream/70 hover:text-booth-cream"
          >
            ← Frames
          </button>
          <SessionProgress current={displayIndex} total={layout.slots.length} />
        </div>

        <div className="relative flex-1">
          <CameraPreview videoRef={videoRef} facingMode={facingMode} isReady={isReady && !error} />
          <CountdownOverlay
            visible={session.status === 'countdown' || session.status === 'capturing'}
            value={session.countdownValue}
          />
          <CaptureFlash active={session.status === 'capturing'} />

          {session.status === 'reviewing' && lastPhoto && (
            <div className="absolute inset-0 z-20 overflow-hidden rounded-[2rem] bg-booth-ink/50 p-4 backdrop-blur-sm">
              <img
                src={lastPhoto.dataUrl}
                alt="Captured pose preview"
                className="h-full w-full rounded-[1.5rem] object-cover"
              />
              <p className="absolute bottom-8 left-0 right-0 text-center text-sm font-semibold tracking-wide">
                Nice! Pick a camera for the next photo.
              </p>
            </div>
          )}

          {session.status === 'composing' && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[2rem] bg-booth-ink/70">
              <p className="animate-pulse font-medium">Developing your strip…</p>
            </div>
          )}
        </div>

        <div className="mt-5 space-y-3">
          {error ? (
            <div className="space-y-3 rounded-3xl bg-white/10 p-4 ring-1 ring-white/15">
              <p className="text-sm leading-relaxed text-booth-cream/90">{error.message}</p>
              <div className="flex flex-wrap gap-2">
                <Button onClick={retry}>Try again</Button>
                <Button variant="ghost" onClick={onBack} className="bg-white/10 text-booth-cream ring-white/20">
                  Choose another frame
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-center text-sm text-booth-cream/70">
                {session.status === 'countdown' || session.status === 'capturing'
                  ? 'Hold your pose'
                  : session.status === 'reviewing'
                    ? 'Looking good'
                    : canSwitch
                      ? `Photo ${displayIndex} of ${layout.slots.length}: choose a camera, then tap start`
                      : `Photo ${displayIndex} of ${layout.slots.length}: tap start when ready`}
              </p>
              <CameraControls
                canSwitch={canSwitch}
                facingMode={facingMode}
                onSelect={selectCamera}
                disabled={busy || isSwitching}
              />
              <Button
                onClick={startPose}
                disabled={!isReady || busy}
                className="min-h-14 w-full text-lg"
              >
                {`Start Photo ${displayIndex}`}
              </Button>
            </>
          )}

          {session.status === 'error' && session.errorMessage && (
            <p className="rounded-2xl bg-booth-crimson/20 px-4 py-3 text-sm text-booth-blush">
              {session.errorMessage}
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
