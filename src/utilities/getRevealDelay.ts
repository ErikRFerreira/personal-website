export function getRevealDelay(index: number, increment: number, cap: number) {
  return Math.min(Math.max(0, index) * increment, cap)
}
