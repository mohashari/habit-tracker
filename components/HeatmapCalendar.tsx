'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material/styles'

interface Props {
  checkIns: string[]  // YYYY-MM-DD dates
  color: string
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const WEEKS = 15

export default function HeatmapCalendar({ checkIns, color }: Props) {
  const theme = useTheme()
  const set = new Set(checkIns)

  // Build grid: WEEKS columns × 7 rows, ending today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - (WEEKS * 7 - 1))

  const cells: { date: string; done: boolean }[][] = Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const cell = new Date(startDate)
      cell.setDate(startDate.getDate() + w * 7 + d)
      const dateStr = cell.toLocaleDateString('en-CA')
      return { date: dateStr, done: set.has(dateStr) }
    })
  )

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: '3px' }}>
        {/* Day labels */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '3px', mr: 0.5 }}>
          <Box sx={{ height: 12 }} />
          {DAYS.map((d, i) => (
            <Box key={d} sx={{ height: 12, display: 'flex', alignItems: 'center' }}>
              {i % 2 === 1 && (
                <Typography variant="caption" sx={{ fontSize: 9, color: 'text.disabled', lineHeight: 1 }}>
                  {d}
                </Typography>
              )}
            </Box>
          ))}
        </Box>

        {/* Grid */}
        {cells.map((week, wi) => (
          <Box key={wi} sx={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {/* Month label for first week of month */}
            <Box sx={{ height: 12 }}>
              {week[0].date.endsWith('-01') || wi === 0 ? (
                <Typography variant="caption" sx={{ fontSize: 9, color: 'text.disabled', lineHeight: 1 }}>
                  {new Date(week[0].date).toLocaleString('default', { month: 'short' })}
                </Typography>
              ) : null}
            </Box>
            {week.map((cell) => (
              <Tooltip key={cell.date} title={cell.date} placement="top" arrow>
                <Box
                  sx={{
                    width: 12, height: 12, borderRadius: '2px',
                    bgcolor: cell.done ? color : theme.palette.action.hover,
                    opacity: cell.done ? 1 : 0.5,
                    transition: 'opacity 0.2s',
                    cursor: 'default',
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  )
}
