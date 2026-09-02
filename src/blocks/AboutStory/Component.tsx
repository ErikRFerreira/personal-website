import type { AboutStoryBlock as AboutStoryBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'

export function AboutStoryBlock({ eyebrow, heading, body }: AboutStoryBlockProps) {
  return (
    <section aria-labelledby="about-story-heading">
      {eyebrow && <p>{eyebrow}</p>}
      <h2 id="about-story-heading">{heading}</h2>
      <RichText data={body} enableGutter={false} />
    </section>
  )
}
