// Calculate current streak from an array of YYYY-MM-DD check-in dates
export function calcStreak(dates: string[]): number {
  if (!dates.length) return 0

  const sorted = Array.from(new Set(dates)).sort().reverse()
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  // Streak must start from today or yesterday
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0

  let streak = 1
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1])
    const curr = new Date(sorted[i])
    const diff = (prev.getTime() - curr.getTime()) / 86400000
    if (diff === 1) streak++
    else break
  }
  return streak
}

export function toLocalDate(date = new Date()): string {
  return date.toLocaleDateString('en-CA') // YYYY-MM-DD in local time
}
