import { useCallback, useEffect, useRef, useState } from 'react'

export type FacingMode = 'user' | 'environment'

export type CameraErrorCode =
  | 'unsupported'
  | 'denied'
  | 'not-found'
  | 'in-use'
  | 'secure-context'
  | 'unknown'

export type CameraError = {
  code: CameraErrorCode
  message: string
}

function mapCameraError(error: unknown): CameraError {
  if (!window.isSecureContext && window.location.hostname !== 'localhost') {
    return {
      code: 'secure-context',
      message: 'Camera access needs a secure connection. Open SnapBooth over HTTPS or localhost.',
    }
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    return {
      code: 'unsupported',
      message: 'This browser does not support camera access. Try Chrome, Safari, or Edge.',
    }
  }

  if (error instanceof DOMException) {
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      return {
        code: 'denied',
        message: 'Camera permission was denied. Allow camera access and try again.',
      }
    }
    if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      return {
        code: 'not-found',
        message: 'No camera was found on this device.',
      }
    }
    if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      return {
        code: 'in-use',
        message: 'Your camera is busy in another app. Close it and try again.',
      }
    }
  }

  return {
    code: 'unknown',
    message: 'Something went wrong while starting the camera. Please try again.',
  }
}

async function getVideoInputCount(): Promise<number> {
  if (!navigator.mediaDevices?.enumerateDevices) return 0
  const devices = await navigator.mediaDevices.enumerateDevices()
  return devices.filter((device) => device.kind === 'videoinput').length
}

export function useCamera(enabled: boolean) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<FacingMode>('user')
  const [isReady, setIsReady] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)
  const [canSwitch, setCanSwitch] = useState(false)
  const [error, setError] = useState<CameraError | null>(null)

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsReady(false)
  }, [])

  const startStream = useCallback(
    async (nextFacing: FacingMode) => {
      if (!enabled) return

      setError(null)
      setIsReady(false)

      if (!navigator.mediaDevices?.getUserMedia) {
        setError(mapCameraError(new Error('unsupported')))
        return
      }

      stopStream()

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: nextFacing },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })

        streamRef.current = stream

        const video = videoRef.current
        if (!video) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        video.srcObject = stream
        await video.play()
        setIsReady(true)

        const count = await getVideoInputCount()
        setCanSwitch(count > 1)
      } catch (err) {
        setError(mapCameraError(err))
        setIsReady(false)
      }
    },
    [enabled, stopStream],
  )

  useEffect(() => {
    if (!enabled) {
      stopStream()
      setError(null)
      return
    }

    void startStream(facingMode)

    return () => {
      stopStream()
    }
  }, [enabled, facingMode, startStream, stopStream])

  const switchCamera = useCallback(async () => {
    if (!canSwitch || isSwitching) return
    setIsSwitching(true)
    setFacingMode((current) => (current === 'user' ? 'environment' : 'user'))
    setIsSwitching(false)
  }, [canSwitch, isSwitching])

  const retry = useCallback(() => {
    void startStream(facingMode)
  }, [facingMode, startStream])

  return {
    videoRef,
    facingMode,
    isReady,
    isSwitching,
    canSwitch,
    error,
    switchCamera,
    retry,
    stop: stopStream,
  }
}
