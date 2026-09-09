import { Hexagon } from 'lucide-react'

type AccentHexagonProps = {
  className?: string
}

export function AccentHexagon({ className = '' }: AccentHexagonProps) {
  return (
    <Hexagon
      aria-hidden="true"
      className={`h-4 w-4 shrink-0 fill-current text-site-accent ${className}`}
      data-accent-hexagon="true"
      strokeWidth={1.5}
    />
  )
}
