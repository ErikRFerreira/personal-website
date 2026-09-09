'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useEffect, type ReactNode } from 'react'

gsap.registerPlugin(ScrollTrigger)

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      anchors: true,
      autoRaf: false,
      lerp: 0.1,
      respectReducedMotion: true,
      smoothWheel: true,
      stopInertiaOnNavigate: true,
      syncTouch: false,
    })

    const syncScrollTrigger = () => ScrollTrigger.update()
    const unsubscribe = lenis.on('scroll', syncScrollTrigger)
    const update = (time: number) => lenis.raf(time * 1000)

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    ScrollTrigger.refresh()

    return () => {
      unsubscribe()
      gsap.ticker.remove(update)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
    }
  }, [])

  return children
}
