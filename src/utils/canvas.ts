import type { CapturedPhoto, LayoutConfig } from '../types/photobooth'
import { drawImageCover, loadImage } from './image'

export async function composePhotoboothImage(
  layout: LayoutConfig,
  photos: CapturedPhoto[],
): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = layout.canvas.width
  canvas.height = layout.canvas.height

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Could not create a canvas for your photobooth strip.')
  }

  ctx.fillStyle = '#111111'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (let index = 0; index < layout.slots.length; index += 1) {
    const slot = layout.slots[index]
    const photo = photos[index]
    if (!slot || !photo) continue

    const image = await loadImage(photo.dataUrl)
    drawImageCover(ctx, image, slot.x, slot.y, slot.width, slot.height)
  }

  const frame = await loadImage(layout.frameSrc)
  ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/png')
  })

  if (!blob) {
    throw new Error('Could not generate your photobooth image.')
  }

  return blob
}
