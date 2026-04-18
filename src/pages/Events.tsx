import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { store } from '../store'

function getMonthDays(year: number, month: number) {
  const first = new Date(year, month - 1, 1)
  const last = new Date(year, month, 0)
  const startPad = first.getDay() === 0 ? 6 : first.getDay() - 1
  const daysInMonth = last.getDate()
  const total = startPad + daysInMonth
  const rows = Math.ceil(total / 7)
  const grid: (number | null)[] = []
  for (let i = 0; i < startPad; i++) grid.push(null)
  for (let d = 1; d <= daysInMonth; d++) grid.push(d)
  const rest = rows * 7 - grid.length
  for (let i = 0; i < rest; i++) grid.push(null)
  return { grid, daysInMonth }
}

export default function Events() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const events = store.getEvents()
  const upcoming = store.getUpcomingEvents(30)

  const { grid } = useMemo(() => getMonthDays(year, month), [year, month])
  const eventsByDate = useMemo(() => {
    const map = new Map<string, typeof events>()
    for (const e of events) {
      const d = e.eventDate
      if (!map.has(d)) map.set(d, [])
      map.get(d)!.push(e)
    }
    return map
  }, [events])

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12)
      setYear((y) => y - 1)
    } else setMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (month === 12) {
      setMonth(1)
      setYear((y) => y + 1)
    } else setMonth((m) => m + 1)
  }

  const weekDays = ['一', '二', '三', '四', '五', '六', '日']

  return (
    <div className="pb-4">
      <header className="bg-card px-4 py-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-text">事件日历</h1>
        <div className="flex items-center justify-between mt-4">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100">◀</button>
          <span className="font-medium">{year} 年 {month} 月</span>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100">▶</button>
        </div>
      </header>

      <div className="px-4 py-4">
        <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 text-center text-sm text-text-secondary border-b border-gray-100">
            {weekDays.map((d) => (
              <div key={d} className="py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {grid?.map((day, i) => {
              if (day === null) return <div key={i} className="aspect-square" />
              const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const dayEvents = eventsByDate.get(dateStr) || []
              const isToday =
                today.getFullYear() === year && today.getMonth() + 1 === month && today.getDate() === day
              return (
                <div
                  key={i}
                  className={`aspect-square flex flex-col items-center justify-center border-b border-r border-gray-100 last:border-r-0 ${
                    isToday ? 'bg-primary/10 text-primary font-medium' : 'text-text'
                  }`}
                >
                  <span>{day}</span>
                  {dayEvents.length > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <section className="px-4 mt-4">
        <h2 className="text-base font-medium text-text mb-3">即将到来</h2>
        {upcoming.length === 0 ? (
          <p className="text-text-hint text-sm py-4">暂无即将到来的事件</p>
        ) : (
          <ul className="bg-card rounded-xl shadow-sm overflow-hidden">
            {upcoming.slice(0, 15).map((e) => {
              const friend = store.getFriend(e.friendId)
              return (
                <li key={e.id}>
                  <Link
                    to={`/friends/${e.friendId}`}
                    className="flex gap-3 px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50"
                  >
                    <div className="text-primary font-medium text-sm flex-shrink-0 w-14">{e.eventDate.slice(5)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-text">{e.title}</div>
                      <div className="text-sm text-text-secondary">{friend?.name} · {e.eventType}</div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
