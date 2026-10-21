// Navegação circular
export function wrapIndex(index: number, total: number): number {
  if (total <= 0) return 0
  return ((index % total) + total) % total
}

const SWIPE_THRESHOLD_PX = 40

export function swipeDirection(startX: number, endX: number): -1 | 0 | 1 {
  const delta = endX - startX
  if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return 0
  return delta < 0 ? 1 : -1
}
