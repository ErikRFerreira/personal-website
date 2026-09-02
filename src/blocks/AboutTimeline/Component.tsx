import type { AboutTimelineBlock as AboutTimelineBlockProps } from '@/payload-types'

export function AboutTimelineBlock({ eyebrow, milestones }: AboutTimelineBlockProps) {
  return (
    <section aria-labelledby="about-timeline-heading">
      <h2 id="about-timeline-heading">{eyebrow || 'Timeline'}</h2>
      <ol>
        {milestones.map(({ year, title, description, image, metadata }, index) => (
          <li data-has-image={Boolean(image)} key={index}>
            <p>{year}</p>
            {title && <h3>{title}</h3>}
            <p>{description}</p>
            {metadata && metadata.length > 0 && (
              <dl>
                {metadata.map(({ label, value }, metadataIndex) => (
                  <div key={metadataIndex}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
