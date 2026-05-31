import React from 'react'

import type { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'

type Props = {
  photo: MediaType
}

export const LensHero: React.FC<Props> = ({ photo }) => {
  return (
    <div className="relative w-full" style={{ height: '55vh', minHeight: '400px' }}>
      <Media resource={photo} fill priority imgClassName="object-cover" />
    </div>
  )
}
