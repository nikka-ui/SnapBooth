type PrivacyNoteProps = {
  className?: string
}

export function PrivacyNote({ className = '' }: PrivacyNoteProps) {
  return (
    <p className={`text-sm leading-relaxed text-booth-ink/70 ${className}`}>
      Your photos stay on your device. SnapBooth does not upload your photos.
    </p>
  )
}
