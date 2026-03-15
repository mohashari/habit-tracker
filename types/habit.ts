export interface Habit {
  id: string
  user_id: string
  name: string
  color: string
  icon: string
  created_at: string
}

export interface CheckIn {
  id: string
  habit_id: string
  user_id: string
  date: string  // YYYY-MM-DD
  created_at: string
}

export interface HabitWithStats extends Habit {
  checkIns: string[]   // array of YYYY-MM-DD strings
  streak: number
  todayDone: boolean
}

export const HABIT_COLORS = [
  '#7c3aed', '#2563eb', '#059669', '#d97706',
  '#dc2626', '#db2777', '#0891b2', '#65a30d',
]

export const HABIT_ICONS = ['⭐', '💪', '📚', '🏃', '💧', '🧘', '🎯', '🥗', '😴', '✍️', '🎵', '🌿']
