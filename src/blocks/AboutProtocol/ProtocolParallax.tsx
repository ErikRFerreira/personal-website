'use client'

import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef, useSyncExternalStore, type ReactNode } from 'react'

type ProtocolParallaxProps = {
  principles: ReactNode
  quote: ReactNode
}

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

function subscribeToReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia(reducedMotionQuery)
  mediaQuery.addEventListener('change', callback)

  return () => mediaQuery.removeEventListener('change', callback)
}

function getReducedMotionPreference() {
  return window.matchMedia(reducedMotionQuery).matches
}

export function ProtocolParallax({ principles, quote }: ProtocolParallaxProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionPreference,
    () => false,
  )
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ['start end', 'end start'],
  })
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30,
    mass: 0.3,
    stiffness: 150,
  })
  const principlesY = useTransform(smoothProgress, [0, 1], [-10, 10])
  const quoteY = useTransform(smoothProgress, [0, 1], [14, -14])

  return (
    <div
      className="mt-12 grid grid-cols-1 items-center gap-12 md:mt-16 md:grid-cols-2 md:gap-12 lg:gap-16"
      data-reduced-motion={shouldReduceMotion ? 'true' : 'false'}
      data-testid="about-protocol-content"
      ref={gridRef}
    >
      <motion.div
        data-parallax-layer="principles"
        style={{ y: shouldReduceMotion ? 0 : principlesY }}
      >
        {principles}
      </motion.div>
      <motion.div data-parallax-layer="quote" style={{ y: shouldReduceMotion ? 0 : quoteY }}>
        {quote}
      </motion.div>
    </div>
  )
}
