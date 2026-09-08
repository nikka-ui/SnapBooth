import { AnimatePresence, motion } from 'framer-motion'

type CaptureFlashProps = {
  active: boolean
}

export function CaptureFlash({ active }: CaptureFlashProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 rounded-[2rem] bg-white"
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        />
      )}
    </AnimatePresence>
  )
}
