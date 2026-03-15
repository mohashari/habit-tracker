'use client'

import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import { HabitWithStats } from '@/types/habit'
import { toLocalDate } from '@/lib/streak'

interface Props {
  habits: HabitWithStats[]
}

export default function WeeklySummary({ habits }: Props) {
  if (!habits.length) return null

  // Last 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return toLocalDate(d)
  })

  const completedToday = habits.filter((h) => h.todayDone).length
  const totalHabits = habits.length
  const weeklyRate = habits.length
    ? Math.round(
        (habits.reduce((sum, h) => sum + days.filter((d) => h.checkIns.includes(d)).length, 0) /
          (habits.length * 7)) * 100
      )
    : 0

  return (
    <Card>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" fontWeight={700} mb={2}>
          📊 This Week
        </Typography>

        {/* Today progress */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">Today</Typography>
            <Typography variant="body2" fontWeight={700}>{completedToday}/{totalHabits}</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={totalHabits ? (completedToday / totalHabits) * 100 : 0}
            sx={{ height: 8, borderRadius: 4 }}
            color="primary"
          />
        </Box>

        {/* Weekly completion rate */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">Weekly rate</Typography>
            <Typography variant="body2" fontWeight={700}>{weeklyRate}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={weeklyRate}
            sx={{ height: 8, borderRadius: 4 }}
            color="secondary"
          />
        </Box>

        {/* Day grid */}
        <Box sx={{ display: 'flex', gap: 0.5, mt: 2.5 }}>
          {days.map((day) => {
            const count = habits.filter((h) => h.checkIns.includes(day)).length
            const pct = totalHabits ? count / totalHabits : 0
            const isToday = day === toLocalDate()
            return (
              <Box key={day} sx={{ flex: 1, textAlign: 'center' }}>
                <Box
                  sx={{
                    height: 36,
                    borderRadius: 1,
                    bgcolor: pct === 0 ? 'action.hover' : 'primary.main',
                    opacity: pct === 0 ? 0.3 : 0.3 + pct * 0.7,
                    border: isToday ? '2px solid' : 'none',
                    borderColor: 'primary.main',
                    mb: 0.5,
                  }}
                />
                <Typography variant="caption" sx={{ fontSize: 9, color: isToday ? 'primary.main' : 'text.disabled' }}>
                  {new Date(day).toLocaleString('default', { weekday: 'narrow' })}
                </Typography>
              </Box>
            )
          })}
        </Box>
      </CardContent>
    </Card>
  )
}
