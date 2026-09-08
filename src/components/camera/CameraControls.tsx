import { Button } from '../ui/Button'

type CameraControlsProps = {
  canSwitch: boolean
  isSwitching: boolean
  onSwitch: () => void
  disabled?: boolean
}

export function CameraControls({
  canSwitch,
  isSwitching,
  onSwitch,
  disabled,
}: CameraControlsProps) {
  if (!canSwitch) return null

  return (
    <Button
      variant="ghost"
      onClick={onSwitch}
      disabled={disabled || isSwitching}
      aria-label="Switch camera"
      className="min-w-[9.5rem]"
    >
      Switch Camera
    </Button>
  )
}
