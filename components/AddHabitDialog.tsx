'use client'

import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { HABIT_COLORS, HABIT_ICONS } from '@/types/habit'

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (name: string, color: string, icon: string) => void
  loading: boolean
}

export default function AddHabitDialog({ open, onClose, onAdd, loading }: Props) {
  const [name, setName] = React.useState('')
  const [color, setColor] = React.useState(HABIT_COLORS[0])
  const [icon, setIcon] = React.useState(HABIT_ICONS[0])

  function handleAdd() {
    if (!name.trim()) return
    onAdd(name.trim(), color, icon)
    setName('')
    setColor(HABIT_COLORS[0])
    setIcon(HABIT_ICONS[0])
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle fontWeight={700}>New Habit</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Habit name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          sx={{ mb: 3, mt: 1 }}
        />

        {/* Icon picker */}
        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
          Icon
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {HABIT_ICONS.map((ic) => (
            <Box
              key={ic}
              onClick={() => setIcon(ic)}
              sx={{
                width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.3rem', borderRadius: 2, cursor: 'pointer',
                border: '2px solid', borderColor: icon === ic ? 'primary.main' : 'divider',
                bgcolor: icon === ic ? 'primary.main' : 'transparent',
                transition: 'all 0.15s',
              }}
            >
              {ic}
            </Box>
          ))}
        </Box>

        {/* Color picker */}
        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
          Color
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {HABIT_COLORS.map((c) => (
            <Box
              key={c}
              onClick={() => setColor(c)}
              sx={{
                width: 32, height: 32, borderRadius: '50%', bgcolor: c, cursor: 'pointer',
                border: '3px solid', borderColor: color === c ? 'text.primary' : 'transparent',
                transition: 'border-color 0.15s',
              }}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd} disabled={!name.trim() || loading}>
          Add Habit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
