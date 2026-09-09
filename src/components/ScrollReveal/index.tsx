'use client'

import React, { useEffect, useRef, useMemo, type ReactNode, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ScrollReveal.css'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealProps {
  children: ReactNode
  as?: 'div' | 'h3'
  scrollContainerRef?: RefObject<HTMLElement>
  enableBlur?: boolean
  baseOpacity?: number
  baseRotation?: number
  blurStrength?: number
  containerClassName?: string
  textClassName?: string
  rotationEnd?: string
  wordAnimationEnd?: string
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  as = 'h3',
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom',
}) => {
  const containerRef = useRef<HTMLElement>(null)

  const splitText = useMemo(() => {
    if (typeof children !== 'string') return children

    const text = children
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word
      return (
        <span className="word scroll-reveal-word" key={index}>
          {word}
        </span>
      )
    })
  }, [children])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const context = gsap.context(() => {
      const scroller =
        scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window

      if (baseRotation !== 0) {
        gsap.fromTo(
          el,
          { transformOrigin: '0% 50%', rotate: baseRotation },
          {
            ease: 'none',
            rotate: 0,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: 'top bottom',
              end: rotationEnd,
              scrub: true,
            },
          },
        )
      }

      const wordElements = el.querySelectorAll<HTMLElement>('.scroll-reveal-word')

      gsap.fromTo(
        wordElements,
        { opacity: baseOpacity, willChange: 'opacity' },
        {
          ease: 'none',
          opacity: 1,
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom-=20%',
            end: wordAnimationEnd,
            scrub: true,
          },
        },
      )

      if (enableBlur) {
        gsap.fromTo(
          wordElements,
          { filter: `blur(${blurStrength}px)` },
          {
            ease: 'none',
            filter: 'blur(0px)',
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: 'top bottom-=20%',
              end: wordAnimationEnd,
              scrub: true,
            },
          },
        )
      }
    }, el)

    return () => context.revert()
  }, [
    scrollContainerRef,
    enableBlur,
    baseRotation,
    baseOpacity,
    rotationEnd,
    wordAnimationEnd,
    blurStrength,
  ])

  if (as === 'div') {
    return (
      <div
        ref={containerRef as React.RefObject<HTMLDivElement>}
        className={`scroll-reveal ${containerClassName}`}
        data-scroll-reveal="true"
      >
        <div className={`scroll-reveal-text ${textClassName}`}>{splitText}</div>
      </div>
    )
  }

  return (
    <h3
      ref={containerRef as React.RefObject<HTMLHeadingElement>}
      className={`scroll-reveal ${containerClassName}`}
      data-scroll-reveal="true"
    >
      <span className={`scroll-reveal-text ${textClassName}`}>{splitText}</span>
    </h3>
  )
}

export default ScrollReveal
