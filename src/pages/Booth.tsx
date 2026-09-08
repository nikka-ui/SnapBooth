import { useCallback, useEffect, useRef } from 'react'
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
  const autoRunRef = useRef(false)
  const {
    videoRef,
    facingMode,
    isReady,
    isSwitching,
    canSwitch,
    error,
    switchCamera,
    retry,
    stop,
  } = useCamera(true)

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
    autoRunRef.current = true
    onBeginCountdown(runCapture)
  }, [onBeginCountdown, runCapture])

  useEffect(() => {
    if (
      autoRunRef.current &&
      session.status === 'ready' &&
      session.capturedPhotos.length > 0 &&
      session.capturedPhotos.length < layout.slots.length
    ) {
      const timer = window.setTimeout(() => {
        onBeginCountdown(runCapture)
      }, 400)
      return () => window.clearTimeout(timer)
    }
  }, [
    layout.slots.length,
    onBeginCountdown,
    runCapture,
    session.capturedPhotos.length,
    session.status,
  ])

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
                Nice! Next pose coming up…
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
                {session.capturedPhotos.length === 0
                  ? 'Get ready!'
                  : session.status === 'reviewing'
                    ? 'Looking good'
                    : 'Hold your pose'}
              </p>
              <div className="flex gap-3">
                <CameraControls
                  canSwitch={canSwitch}
                  isSwitching={isSwitching}
                  onSwitch={() => void switchCamera()}
                  disabled={busy}
                />
                <Button
                  onClick={startPose}
                  disabled={!isReady || busy}
                  className="min-h-14 flex-1 text-lg"
                >
                  {session.capturedPhotos.length === 0 ? 'Start Session' : 'Capture Next'}
                </Button>
              </div>
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
