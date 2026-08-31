'use client'

import { cn } from '@/utilities/ui'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type RevealOnScrollProps = {
  children: ReactNode
  className?: string
  delay?: number
  revealName?: string
}

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  revealName,
}: RevealOnScrollProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const revealStyle = {
    '--reveal-delay': `${Math.max(0, delay)}ms`,
  } as CSSProperties

  useEffect(() => {
    const element = elementRef.current
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (!element || motionQuery.matches || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8%', threshold: 0.08 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={cn(
        'transition-[opacity,transform] duration-700 delay-[var(--reveal-delay)] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        className,
      )}
      data-reveal-name={revealName}
      data-reveal-state={isVisible ? 'visible' : 'hidden'}
      ref={elementRef}
      style={revealStyle}
    >
      {children}
    </div>
  )
}
