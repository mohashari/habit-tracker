import type { Metadata } from 'next'
import ThemeRegistry from '@/lib/ThemeRegistry'

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Build better habits, one day at a time',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}
