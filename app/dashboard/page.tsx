'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Alert from '@mui/material/Alert'
import Fab from '@mui/material/Fab'
import Collapse from '@mui/material/Collapse'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import AddIcon from '@mui/icons-material/Add'
import LogoutIcon from '@mui/icons-material/Logout'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ThemeToggleContext } from '@/lib/ThemeRegistry'
import { calcStreak, toLocalDate } from '@/lib/streak'
import { Habit, HabitWithStats } from '@/types/habit'
import HabitCard from '@/components/HabitCard'
import AddHabitDialog from '@/components/AddHabitDialog'
import WeeklySummary from '@/components/WeeklySummary'
import HeatmapCalendar from '@/components/HeatmapCalendar'

const QUOTES = [
  "Small steps every day lead to big changes.",
  "Motivation gets you started. Habit keeps you going.",
  "You don't rise to the level of your goals, you fall to the level of your systems.",
  "The secret of your future is hidden in your daily routine.",
  "Success is the sum of small efforts repeated day in and day out.",
]

export default function DashboardPage() {
  const router = useRouter()
  const { mode, setMode } = React.useContext(ThemeToggleContext)
  const supabase = React.useMemo(() => createClient(), [])

  const [habits, setHabits] = React.useState<HabitWithStats[]>([])
  const [loading, setLoading] = React.useState(true)
  const [actionLoading, setActionLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [expandedHabit, setExpandedHabit] = React.useState<string | null>(null)
  const quote = React.useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], [])

  const today = toLocalDate()

  async function loadHabits() {
    setLoading(true)
    setError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const [{ data: habitsData, error: hErr }, { data: checkIns, error: cErr }] = await Promise.all([
        supabase.from('habits').select('*').eq('user_id', user.id).order('created_at'),
        supabase.from('check_ins').select('habit_id, date').eq('user_id', user.id),
      ])
      if (hErr) throw hErr
      if (cErr) throw cErr

      const checkInMap: Record<string, string[]> = {}
      for (const ci of (checkIns ?? [])) {
        if (!checkInMap[ci.habit_id]) checkInMap[ci.habit_id] = []
        checkInMap[ci.habit_id].push(ci.date)
      }

      setHabits(
        (habitsData ?? []).map((h: Habit) => ({
          ...h,
          checkIns: checkInMap[h.id] ?? [],
          streak: calcStreak(checkInMap[h.id] ?? []),
          todayDone: (checkInMap[h.id] ?? []).includes(today),
        }))
      )
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load habits')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => { loadHabits() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleAdd(name: string, color: string, icon: string) {
    setActionLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('habits').insert({ user_id: user.id, name, color, icon })
    if (error) setError(error.message)
    else { setDialogOpen(false); await loadHabits() }
    setActionLoading(false)
  }

  async function handleToggle(habitId: string) {
    setActionLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const habit = habits.find((h) => h.id === habitId)
    if (!habit) return

    if (habit.todayDone) {
      await supabase.from('check_ins').delete()
        .eq('habit_id', habitId).eq('user_id', user.id).eq('date', today)
    } else {
      await supabase.from('check_ins').insert({ habit_id: habitId, user_id: user.id, date: today })
    }
    await loadHabits()
    setActionLoading(false)
  }

  async function handleDelete(habitId: string) {
    setActionLoading(true)
    await supabase.from('check_ins').delete().eq('habit_id', habitId)
    await supabase.from('habits').delete().eq('id', habitId)
    await loadHabits()
    setActionLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const completedToday = habits.filter((h) => h.todayDone).length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ px: { xs: 2, sm: 4 }, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={700} color="primary">Habit Tracker</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
            <IconButton onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Sign out">
            <IconButton onClick={handleLogout}><LogoutIcon /></IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Container maxWidth="sm" sx={{ py: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

        {/* Greeting */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={700}>
            {completedToday === habits.length && habits.length > 0 ? '🎉 All done today!' : 'Good ' + (new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening') + '!'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontStyle: 'italic' }}>
            &ldquo;{quote}&rdquo;
          </Typography>
        </Box>

        {/* Weekly summary */}
        <Box sx={{ mb: 3 }}>
          <WeeklySummary habits={habits} />
        </Box>

        {/* Habits list */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Today&apos;s Habits
          </Typography>
          <Button startIcon={<AddIcon />} size="small" onClick={() => setDialogOpen(true)} variant="outlined">
            Add
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : habits.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary">No habits yet</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>Add your first habit to get started</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
              Add Habit
            </Button>
          </Card>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {habits.map((habit) => (
              <Box key={habit.id}>
                <HabitCard
                  habit={habit}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  loading={actionLoading}
                />
                {/* Expand heatmap */}
                <Box
                  onClick={() => setExpandedHabit(expandedHabit === habit.id ? null : habit.id)}
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', cursor: 'pointer', pr: 1, mt: 0.25 }}
                >
                  <Typography variant="caption" color="text.disabled">history</Typography>
                  {expandedHabit === habit.id ? <ExpandLessIcon sx={{ fontSize: 14, color: 'text.disabled' }} /> : <ExpandMoreIcon sx={{ fontSize: 14, color: 'text.disabled' }} />}
                </Box>
                <Collapse in={expandedHabit === habit.id}>
                  <Card variant="outlined" sx={{ mt: 0.5, mb: 0.5, overflow: 'auto' }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <HeatmapCalendar checkIns={habit.checkIns} color={habit.color} />
                    </CardContent>
                  </Card>
                </Collapse>
              </Box>
            ))}
          </Box>
        )}
      </Container>

      {/* FAB */}
      <Fab
        color="primary"
        onClick={() => setDialogOpen(true)}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        <AddIcon />
      </Fab>

      <AddHabitDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={handleAdd}
        loading={actionLoading}
      />
    </Box>
  )
}
