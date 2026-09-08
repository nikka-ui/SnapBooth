export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    image.src = src
  })
}

function getSourceSize(image: CanvasImageSource): { width: number; height: number } {
  if (image instanceof HTMLVideoElement) {
    return { width: image.videoWidth, height: image.videoHeight }
  }
  if (image instanceof HTMLImageElement) {
    return { width: image.naturalWidth, height: image.naturalHeight }
  }
  if (image instanceof HTMLCanvasElement || image instanceof ImageBitmap || image instanceof OffscreenCanvas) {
    return { width: image.width, height: image.height }
  }
  return { width: 0, height: 0 }
}

/** Draw an image into a destination rect using object-fit: cover. */
export function drawImageCover(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  dx: number,
  dy: number,
  dWidth: number,
  dHeight: number,
): void {
  const { width: sourceWidth, height: sourceHeight } = getSourceSize(image)

  if (!sourceWidth || !sourceHeight) return

  const scale = Math.max(dWidth / sourceWidth, dHeight / sourceHeight)
  const drawWidth = sourceWidth * scale
  const drawHeight = sourceHeight * scale
  const offsetX = dx + (dWidth - drawWidth) / 2
  const offsetY = dy + (dHeight - drawHeight) / 2

  ctx.save()
  ctx.beginPath()
  ctx.rect(dx, dy, dWidth, dHeight)
  ctx.clip()
  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)
  ctx.restore()
}

export function captureFrameFromVideo(
  video: HTMLVideoElement,
  options?: { mirror?: boolean; mimeType?: string; quality?: number },
): string {
  const width = video.videoWidth
  const height = video.videoHeight

  if (!width || !height) {
    throw new Error('Camera is not ready to capture yet.')
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Could not create a drawing context for capture.')
  }

  if (options?.mirror) {
    ctx.translate(width, 0)
    ctx.scale(-1, 1)
  }

  ctx.drawImage(video, 0, 0, width, height)

  return canvas.toDataURL(options?.mimeType ?? 'image/jpeg', options?.quality ?? 0.92)
}
