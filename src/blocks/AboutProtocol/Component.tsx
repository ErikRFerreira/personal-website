import type { AboutProtocolBlock as AboutProtocolBlockProps } from '@/payload-types'

export function AboutProtocolBlock({ eyebrow, heading, principles }: AboutProtocolBlockProps) {
  return (
    <section aria-labelledby="about-protocol-heading">
      {eyebrow && <p>{eyebrow}</p>}
      <h2 id="about-protocol-heading">{heading}</h2>
      <ul>
        {principles.map(({ text, quote }, index) => (
          <li key={index}>
            <p>{text}</p>
            <blockquote>{quote}</blockquote>
          </li>
        ))}
      </ul>
    </section>
  )
}
