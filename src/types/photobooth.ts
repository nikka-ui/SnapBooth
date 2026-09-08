export type PhotoFit = 'cover' | 'contain'

export type PhotoSlot = {
  id: string
  x: number
  y: number
  width: number
  height: number
  fit?: PhotoFit
}

export type LayoutConfig = {
  id: string
  name: string
  description: string
  canvas: {
    width: number
    height: number
  }
  frameSrc: string
  thumbnailSrc?: string
  slots: PhotoSlot[]
}

export type CapturedPhoto = {
  id: string
  dataUrl: string
  capturedAt: number
  slotIndex: number
}

export type SessionStatus =
  | 'idle'
  | 'ready'
  | 'countdown'
  | 'capturing'
  | 'reviewing'
  | 'composing'
  | 'complete'
  | 'error'

export type AppStep = 'home' | 'layout' | 'booth' | 'result'

export type PhotoSession = {
  selectedLayoutId: string | null
  capturedPhotos: CapturedPhoto[]
  currentPhotoIndex: number
  status: SessionStatus
  countdownValue: number | null
  composedImageUrl: string | null
  errorMessage?: string
}
