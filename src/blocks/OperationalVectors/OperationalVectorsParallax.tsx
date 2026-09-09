'use client'

import { cn } from '@/utilities/ui'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { Children, useRef, type ReactNode } from 'react'

type OperationalVectorsParallaxProps = {
  children: ReactNode
}

const cardPlacements = [
  'lg:col-span-4',
  'lg:col-span-4',
  'md:col-span-2 md:w-[calc(50%-0.75rem)] md:justify-self-center lg:col-span-4 lg:w-full lg:justify-self-stretch',
]

export function OperationalVectorsParallax({ children }: OperationalVectorsParallaxProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ['start end', 'end start'],
  })
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30,
    mass: 0.3,
    stiffness: 150,
  })
  const firstCardY = useTransform(smoothProgress, [0, 1], [-14, 14])
  const secondCardY = useTransform(smoothProgress, [0, 1], [18, -18])
  const thirdCardY = useTransform(smoothProgress, [0, 1], [-10, 10])
  const cardPositions = [firstCardY, secondCardY, thirdCardY]

  return (
    <div
      className="grid grid-cols-1 items-end gap-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-8"
      data-reduced-motion={shouldReduceMotion ? 'true' : 'false'}
      data-testid="operational-vectors-grid"
      ref={gridRef}
    >
      {Children.toArray(children).map((child, index) => (
        <motion.div
          className={cn('self-end', cardPlacements[index])}
          data-parallax-card={index + 1}
          key={index}
          style={{ y: shouldReduceMotion ? 0 : cardPositions[index] }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}
