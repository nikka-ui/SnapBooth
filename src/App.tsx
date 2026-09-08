import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { usePhotobooth } from './hooks/usePhotobooth'
import { Booth } from './pages/Booth'
import { Home } from './pages/Home'
import { LayoutSelection } from './pages/LayoutSelection'
import { Result } from './pages/Result'
import type { AppStep } from './types/photobooth'

export default function App() {
  const [step, setStep] = useState<AppStep>('home')
  const {
    session,
    selectedLayout,
    selectLayout,
    resetSession,
    hardReset,
    beginCountdown,
    captureFromVideo,
  } = usePhotobooth()

  const goHome = useCallback(() => {
    hardReset()
    setStep('home')
  }, [hardReset])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22 }}
      >
        {step === 'home' && <Home onStart={() => setStep('layout')} />}

        {step === 'layout' && (
          <LayoutSelection
            selectedLayoutId={session.selectedLayoutId}
            onSelect={selectLayout}
            onBack={() => setStep('home')}
            onContinue={() => setStep('booth')}
          />
        )}

        {step === 'booth' && selectedLayout && (
          <Booth
            session={session}
            layout={selectedLayout}
            onBack={() => {
              resetSession()
              setStep('layout')
            }}
            onBeginCountdown={beginCountdown}
            onCapture={captureFromVideo}
            onComplete={() => setStep('result')}
          />
        )}

        {step === 'result' && (
          <Result
            imageUrl={session.composedImageUrl}
            errorMessage={session.errorMessage}
            onRetake={() => {
              resetSession()
              setStep('booth')
            }}
            onHome={goHome}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
