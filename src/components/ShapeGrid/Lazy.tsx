'use client'

import { useNearViewport } from '@/hooks/useNearViewport'
import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'
import type ShapeGrid from './index'

type Props = ComponentProps<typeof ShapeGrid>

const DeferredShapeGrid = dynamic(() => import('./index'), { ssr: false })

export default function LazyShapeGrid(props: Props) {
  const { isNearViewport, prefersReducedMotion, ref } = useNearViewport()

  return (
    <div aria-hidden="true" className="absolute inset-0" ref={ref}>
      {isNearViewport && !prefersReducedMotion ? <DeferredShapeGrid {...props} /> : null}
    </div>
  )
}
