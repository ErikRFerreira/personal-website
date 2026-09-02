'use client'

import { cn } from '@/utilities/ui'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { Children, useRef, type ReactNode } from 'react'

const cardLayouts = [
  'lg:col-span-5 lg:col-start-2 lg:row-start-1',
  'lg:col-span-5 lg:col-start-7 lg:row-start-1 lg:mt-32',
  'md:col-span-2 md:w-[calc(50%-0.75rem)] md:justify-self-center lg:col-span-5 lg:col-start-3 lg:row-start-2 lg:mt-16 lg:w-full lg:justify-self-stretch',
]

type CapabilitiesParallaxProps = {
  children: ReactNode
}

export function CapabilitiesParallax({ children }: CapabilitiesParallaxProps) {
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
  const firstY = useTransform(smoothProgress, [0, 1], [-12, 12])
  const secondY = useTransform(smoothProgress, [0, 1], [18, -18])
  const thirdY = useTransform(smoothProgress, [0, 1], [-16, 16])
  const positions = [firstY, secondY, thirdY]

  return (
    <div
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-8"
      ref={gridRef}
    >
      {Children.toArray(children).map((child, index) => (
        <motion.div
          className={cn('h-full', cardLayouts[index])}
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
