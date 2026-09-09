'use client'

import { cn } from '@/utilities/ui'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import './fade.css'

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
  // Keep server-rendered content readable before JavaScript is available.
  const [isVisible, setIsVisible] = useState(true)
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

    setIsVisible(false)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8%', threshold: 0 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={cn('reveal-on-scroll', className)}
      data-reveal-name={revealName}
      data-reveal-state={isVisible ? 'visible' : 'hidden'}
      ref={elementRef}
      style={revealStyle}
    >
      {children}
    </div>
  )
}
