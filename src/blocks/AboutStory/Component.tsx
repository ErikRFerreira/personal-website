import type { AboutStoryBlock as AboutStoryBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { StoryProgress } from './StoryProgress'

export function AboutStoryBlock({ eyebrow, heading, body }: AboutStoryBlockProps) {
  return (
    <StoryProgress
      body={
        <RichText
          className="space-y-10 text-lg leading-[1.8] text-site-text-secondary [&_a]:text-site-accent [&_a]:underline-offset-4 [&_p]:m-0 md:text-xl"
          data={body}
          enableGutter={false}
          enableProse={false}
        />
      }
      eyebrow={eyebrow}
      heading={heading}
    />
  )
}
