import { AnimatePresence, motion } from 'framer-motion'

type CountdownOverlayProps = {
  value: number | null
  visible: boolean
}

export function CountdownOverlay({ value, visible }: CountdownOverlayProps) {
  return (
    <AnimatePresence>
      {visible && value !== null && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-[2rem] bg-booth-ink/35 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.span
            key={value}
            className="font-display text-[7rem] font-extrabold leading-none text-white drop-shadow-lg sm:text-[8rem]"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          >
            {value === 0 ? '📸' : value}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
