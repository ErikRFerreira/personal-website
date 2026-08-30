'use client'

import { useNearViewport } from '@/hooks/useNearViewport'
import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'
import type LightRays from './index'

type Props = ComponentProps<typeof LightRays>

const DeferredLightRays = dynamic(() => import('./index'), { ssr: false })

export default function LazyLightRays(props: Props) {
  const { isNearViewport, prefersReducedMotion, ref } = useNearViewport()

  return (
    <div aria-hidden="true" className="h-full w-full" ref={ref}>
      {isNearViewport && !prefersReducedMotion ? <DeferredLightRays {...props} /> : null}
    </div>
  )
}
