import React from 'react'

import type { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'

type Props = {
  photo: MediaType
}

export const LensHero: React.FC<Props> = ({ photo }) => {
  return (
    <div className="relative h-[55vh] min-h-[400px] w-full">
      <Media resource={photo} fill priority imgClassName="object-cover" />
    </div>
  )
}
