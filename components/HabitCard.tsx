'use client'

import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Chip from '@mui/material/Chip'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import DeleteIcon from '@mui/icons-material/Delete'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import { HabitWithStats } from '@/types/habit'

interface Props {
  habit: HabitWithStats
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  loading: boolean
}

export default function HabitCard({ habit, onToggle, onDelete, loading }: Props) {
  return (
    <Card
      sx={{
        borderLeft: `4px solid ${habit.color}`,
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 6 },
        opacity: loading ? 0.7 : 1,
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Check-in toggle */}
          <Tooltip title={habit.todayDone ? 'Mark undone' : 'Mark done'}>
            <IconButton
              onClick={() => onToggle(habit.id)}
              disabled={loading}
              sx={{ color: habit.todayDone ? habit.color : 'text.disabled', p: 0.5 }}
            >
              {habit.todayDone
                ? <CheckCircleIcon sx={{ fontSize: 32 }} />
                : <RadioButtonUncheckedIcon sx={{ fontSize: 32 }} />}
            </IconButton>
          </Tooltip>

          {/* Icon + name */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography component="span" sx={{ fontSize: '1.2rem' }}>{habit.icon}</Typography>
              <Typography
                variant="body1"
                fontWeight={600}
                noWrap
                sx={{ textDecoration: habit.todayDone ? 'line-through' : 'none', opacity: habit.todayDone ? 0.6 : 1 }}
              >
                {habit.name}
              </Typography>
            </Box>
          </Box>

          {/* Streak */}
          {habit.streak > 0 && (
            <Chip
              icon={<LocalFireDepartmentIcon sx={{ fontSize: '1rem !important', color: '#f97316 !important' }} />}
              label={`${habit.streak}d`}
              size="small"
              sx={{ fontWeight: 700, bgcolor: 'rgba(249,115,22,0.1)', color: '#f97316', border: 'none' }}
            />
          )}

          {/* Delete */}
          <Tooltip title="Delete habit">
            <IconButton onClick={() => onDelete(habit.id)} size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  )
}
