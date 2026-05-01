import type { SimpleTextBlock as Props } from 'src/payload-types'

import './styles.css'

export function SimpleTextBlock({ text }: Props) {
  return (
    <section className="simple-text-block">
      <div className="container">
        <p className="simple-text-block__text">{text}</p>
      </div>
    </section>
  )
}
