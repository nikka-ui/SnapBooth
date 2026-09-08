export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function shareImageBlob(
  blob: Blob,
  filename: string,
): Promise<'shared' | 'unsupported' | 'cancelled'> {
  const file = new File([blob], filename, { type: blob.type || 'image/png' })

  if (!navigator.share || !navigator.canShare?.({ files: [file] })) {
    return 'unsupported'
  }

  try {
    await navigator.share({
      files: [file],
      title: 'SnapBooth',
      text: 'Made with SnapBooth',
    })
    return 'shared'
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return 'cancelled'
    }
    throw error
  }
}
