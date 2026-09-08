import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getLayoutById } from '../data/layouts'
import type { CapturedPhoto, PhotoSession, SessionStatus } from '../types/photobooth'
import { composePhotoboothImage } from '../utils/canvas'
import { captureFrameFromVideo } from '../utils/image'

const COUNTDOWN_SECONDS = 3
const REVIEW_MS = 900

const initialSession: PhotoSession = {
  selectedLayoutId: null,
  capturedPhotos: [],
  currentPhotoIndex: 0,
  status: 'idle',
  countdownValue: null,
  composedImageUrl: null,
}

function createPhotoId() {
  return `photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function usePhotobooth() {
  const [session, setSession] = useState<PhotoSession>(initialSession)
  const timersRef = useRef<number[]>([])
  const composedUrlRef = useRef<string | null>(null)
  const sessionRef = useRef(session)

  useEffect(() => {
    sessionRef.current = session
  }, [session])

  const selectedLayout = useMemo(
    () => (session.selectedLayoutId ? getLayoutById(session.selectedLayoutId) : undefined),
    [session.selectedLayoutId],
  )

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    timersRef.current = []
  }, [])

  const revokeComposedUrl = useCallback(() => {
    if (composedUrlRef.current) {
      URL.revokeObjectURL(composedUrlRef.current)
      composedUrlRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      clearTimers()
      revokeComposedUrl()
    }
  }, [clearTimers, revokeComposedUrl])

  const setStatus = useCallback((status: SessionStatus, patch?: Partial<PhotoSession>) => {
    setSession((current) => ({ ...current, status, ...patch }))
  }, [])

  const selectLayout = useCallback(
    (layoutId: string) => {
      clearTimers()
      revokeComposedUrl()
      setSession({
        ...initialSession,
        selectedLayoutId: layoutId,
        status: 'ready',
      })
    },
    [clearTimers, revokeComposedUrl],
  )

  const resetSession = useCallback(() => {
    clearTimers()
    revokeComposedUrl()
    setSession((current) => ({
      ...initialSession,
      selectedLayoutId: current.selectedLayoutId,
      status: current.selectedLayoutId ? 'ready' : 'idle',
    }))
  }, [clearTimers, revokeComposedUrl])

  const hardReset = useCallback(() => {
    clearTimers()
    revokeComposedUrl()
    setSession(initialSession)
  }, [clearTimers, revokeComposedUrl])

  const composeResult = useCallback(
    async (photos: CapturedPhoto[], layoutId: string) => {
      const layout = getLayoutById(layoutId)
      if (!layout) {
        setStatus('error', { errorMessage: 'That frame could not be found.' })
        return
      }

      setStatus('composing', { errorMessage: undefined })

      try {
        const blob = await composePhotoboothImage(layout, photos)
        revokeComposedUrl()
        const url = URL.createObjectURL(blob)
        composedUrlRef.current = url
        setSession((current) => ({
          ...current,
          status: 'complete',
          composedImageUrl: url,
        }))
      } catch {
        setStatus('error', {
          errorMessage: 'We could not build your photobooth strip. Please try again.',
        })
      }
    },
    [revokeComposedUrl, setStatus],
  )

  const captureFromVideo = useCallback(
    (video: HTMLVideoElement, mirror: boolean) => {
      const current = sessionRef.current
      const layoutId = current.selectedLayoutId
      const layout = layoutId ? getLayoutById(layoutId) : undefined

      if (!layout || !layoutId) {
        setStatus('error', { errorMessage: 'Choose a frame before starting.' })
        return
      }

      clearTimers()

      try {
        const dataUrl = captureFrameFromVideo(video, { mirror })
        const nextPhoto: CapturedPhoto = {
          id: createPhotoId(),
          dataUrl,
          capturedAt: Date.now(),
          slotIndex: current.currentPhotoIndex,
        }

        const photos = [...current.capturedPhotos, nextPhoto]
        const nextIndex = current.currentPhotoIndex + 1
        const isDone = nextIndex >= layout.slots.length

        setSession({
          ...current,
          capturedPhotos: photos,
          currentPhotoIndex: nextIndex,
          status: 'reviewing',
          countdownValue: null,
          errorMessage: undefined,
        })

        const timer = window.setTimeout(() => {
          if (isDone) {
            void composeResult(photos, layoutId)
          } else {
            setStatus('ready', { countdownValue: null })
          }
        }, REVIEW_MS)

        timersRef.current.push(timer)
      } catch {
        setStatus('error', {
          errorMessage: 'Photo capture failed. Make sure the camera preview is ready.',
        })
      }
    },
    [clearTimers, composeResult, setStatus],
  )

  const beginCountdown = useCallback(
    (onCapture: () => void) => {
      const current = sessionRef.current
      if (current.status === 'countdown' || current.status === 'capturing') return

      const layout = current.selectedLayoutId
        ? getLayoutById(current.selectedLayoutId)
        : undefined

      if (!layout) {
        setStatus('error', { errorMessage: 'Choose a frame before starting.' })
        return
      }

      clearTimers()
      setStatus('countdown', { countdownValue: COUNTDOWN_SECONDS, errorMessage: undefined })

      for (let second = COUNTDOWN_SECONDS - 1; second >= 0; second -= 1) {
        const delay = (COUNTDOWN_SECONDS - second) * 1000
        const timer = window.setTimeout(() => {
          if (second === 0) {
            setSession((prev) => ({
              ...prev,
              status: 'capturing',
              countdownValue: 0,
            }))
            onCapture()
          } else {
            setSession((prev) => ({
              ...prev,
              countdownValue: second,
            }))
          }
        }, delay)
        timersRef.current.push(timer)
      }
    },
    [clearTimers, setStatus],
  )

  return {
    session,
    selectedLayout,
    photoCount: selectedLayout?.slots.length ?? 0,
    selectLayout,
    resetSession,
    hardReset,
    beginCountdown,
    captureFromVideo,
  }
}
