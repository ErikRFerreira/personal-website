export function resolveCSSColor(element: Element, color: string): string {
  const match = color.trim().match(/^var\(\s*(--[\w-]+)\s*(?:,\s*([^)]+))?\)$/)

  if (!match) return color

  const resolved = window.getComputedStyle(element).getPropertyValue(match[1]).trim()

  return resolved || match[2]?.trim() || color
}
