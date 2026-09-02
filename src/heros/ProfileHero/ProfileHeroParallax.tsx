'use client'

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'

type ProfileHeroParallaxProps = {
  imageContent: ReactNode
  textContent: ReactNode
}

export function ProfileHeroParallax({ imageContent, textContent }: ProfileHeroParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30,
    mass: 0.3,
    stiffness: 150,
  })

  const textY = useTransform(smoothProgress, [0, 1], [0, -28])
  const imageY = useTransform(smoothProgress, [0, 1], [0, 36])

  return (
    <div
      className="grid w-full grid-cols-1 items-center gap-14 md:grid-cols-12 md:gap-8 lg:gap-12"
      ref={containerRef}
    >
      <motion.div
        className="relative z-20 md:col-span-8 md:col-start-1 md:row-start-1"
        data-parallax-text
        style={{ y: shouldReduceMotion ? 0 : textY }}
      >
        {textContent}
      </motion.div>

      <motion.div
        className="relative z-10 mt-2 md:col-span-8 md:col-start-5 md:row-start-1 md:mt-32 lg:mt-40"
        data-parallax-image
        style={{ y: shouldReduceMotion ? 0 : imageY }}
      >
        {imageContent}
      </motion.div>
    </div>
  )
}
