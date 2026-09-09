'use client'

import { cn } from '@/utilities/ui'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { Children, useRef, type ReactNode } from 'react'

const parallaxRanges: [number, number][] = [
  [-12, 12],
  [12, -12],
  [-10, 10],
]

type DisciplinesParallaxProps = {
  children: ReactNode
}

export function DisciplinesParallax({ children }: DisciplinesParallaxProps) {
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
  const firstY = useTransform(smoothProgress, [0, 1], parallaxRanges[0])
  const secondY = useTransform(smoothProgress, [0, 1], parallaxRanges[1])
  const thirdY = useTransform(smoothProgress, [0, 1], parallaxRanges[2])
  const positions = [firstY, secondY, thirdY]

  return (
    <div
      className="grid grid-cols-1 items-end gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
      ref={gridRef}
    >
      {Children.toArray(children).map((child, index) => (
        <motion.div
          className={cn(
            index === 2 &&
              'md:col-span-2 md:justify-self-center md:w-[calc(50%-0.75rem)] lg:col-span-1 lg:w-full lg:justify-self-stretch',
          )}
          data-parallax-card={index + 1}
          key={index}
          style={{ y: shouldReduceMotion ? 0 : positions[index] }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}
