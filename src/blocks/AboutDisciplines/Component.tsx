import type { AboutDisciplinesBlock as AboutDisciplinesBlockProps } from '@/payload-types'

export function AboutDisciplinesBlock({ eyebrow, items }: AboutDisciplinesBlockProps) {
  return (
    <section aria-labelledby="about-disciplines-heading">
      <h2 id="about-disciplines-heading">{eyebrow || 'Disciplines'}</h2>
      <ul>
        {items.map(({ title, description, icon, image, tags }, index) => (
          <li data-has-icon={Boolean(icon)} data-has-image={Boolean(image)} key={index}>
            <h3>{title}</h3>
            <p>{description}</p>
            {tags && tags.length > 0 && (
              <ul aria-label={`${title} tags`}>
                {tags.map(({ tag }, tagIndex) => (
                  <li key={tagIndex}>{tag}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
