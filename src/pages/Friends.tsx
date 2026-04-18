import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { store } from '../store'
import type { Friend } from '../types'

function pinyin(c: string): string {
  const code = c.charCodeAt(0)
  if (code >= 0x4e00 && code <= 0x9fa5) {
    // 简单按 Unicode 区间给一个首字母（实际应用可用 pinyin 库）
    if (code < 0x4f00) return 'A'
    if (code < 0x53a0) return 'B'
    if (code < 0x57c0) return 'C'
    if (code < 0x5b80) return 'D'
    if (code < 0x5f60) return 'E'
    if (code < 0x63a0) return 'F'
    if (code < 0x67c0) return 'G'
    if (code < 0x6b80) return 'H'
    if (code < 0x6f60) return 'J'
    if (code < 0x73a0) return 'K'
    if (code < 0x77c0) return 'L'
    if (code < 0x7b80) return 'M'
    if (code < 0x7f60) return 'N'
    if (code < 0x83a0) return 'P'
    if (code < 0x87c0) return 'Q'
    if (code < 0x8b80) return 'R'
    if (code < 0x8f60) return 'S'
    if (code < 0x93a0) return 'T'
    if (code < 0x97c0) return 'W'
    if (code < 0x9b80) return 'X'
    if (code < 0x9f60) return 'Y'
    return 'Z'
  }
  if (c >= 'A' && c <= 'Z') return c.toUpperCase()
  if (c >= 'a' && c <= 'z') return c.toUpperCase()
  if (c >= '0' && c <= '9') return '#'
  return '#'
}

function groupByLetter(list: Friend[]): Map<string, Friend[]> {
  const map = new Map<string, Friend[]>()
  for (const f of list) {
    const first = (f.name || '')[0]
    const letter = first ? pinyin(first) : '#'
    if (!map.has(letter)) map.set(letter, [])
    map.get(letter)!.push(f)
  }
  map.forEach((arr) => arr.sort((a, b) => (a.name > b.name ? 1 : -1)))
  return map
}

export default function Friends() {
  const [groupFilter, setGroupFilter] = useState<string>('')
  const [keyword, setKeyword] = useState('')
  const groups = store.getGroups()
  const allFriends = store.getFriends()
  const filtered = useMemo(() => {
    let list = allFriends
    if (groupFilter) list = list.filter((f) => f.groupId === groupFilter || f.groupName === groupFilter)
    if (keyword.trim()) {
      const k = keyword.trim().toLowerCase()
      list = list.filter(
        (f) =>
          f.name?.toLowerCase().includes(k) ||
          f.nickname?.toLowerCase().includes(k) ||
          f.notes?.toLowerCase().includes(k) ||
          f.tags?.some((t) => t.toLowerCase().includes(k))
      )
    }
    return list.sort((a, b) => (a.name > b.name ? 1 : -1))
  }, [allFriends, groupFilter, keyword])
  const byLetter = useMemo(() => groupByLetter(filtered), [filtered])

  const letters = Array.from(byLetter.keys()).sort((a, b) => (a === '#' ? 1 : b === '#' ? -1 : a.localeCompare(b)))

  return (
    <div className="pb-4">
      <header className="bg-card px-4 py-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-text">我的朋友</h1>
        <input
          type="search"
          placeholder="搜索姓名、标签、备注"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="mt-3 w-full px-3 py-2 rounded-lg border border-gray-200 bg-bg text-sm"
        />
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          <button
            onClick={() => setGroupFilter('')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm ${!groupFilter ? 'bg-primary text-white' : 'bg-gray-100 text-text-secondary'}`}
          >
            全部
          </button>
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => setGroupFilter(groupFilter === g.name ? '' : g.name)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm ${groupFilter === g.name ? 'bg-primary text-white' : 'bg-gray-100 text-text-secondary'}`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 py-2">
        {letters.length === 0 ? (
          <p className="text-text-hint text-center py-12">暂无朋友，点击底部「添加」开始记录</p>
        ) : (
          letters.map((letter) => (
            <section key={letter} className="mb-4">
              <div className="text-sm font-medium text-text-hint py-1">{letter}</div>
              <ul className="bg-card rounded-xl shadow-sm overflow-hidden">
                {(byLetter.get(letter) || []).map((f) => {
                  const events = store.getEventsByFriendId(f.id)
                  const latestEvent = events[0]
                  const family = store.getFamilyByFriendId(f.id)
                  const child = family.find((m) => ['儿子', '女儿'].includes(m.relation))
                  let subtitle = f.groupName || ''
                  if (f.knowDate) {
                    const y = Math.floor((Date.now() - new Date(f.knowDate).getTime()) / (365 * 24 * 60 * 60 * 1000))
                    if (y > 0) subtitle += subtitle ? ` · 认识 ${y} 年` : `认识 ${y} 年`
                  }
                  let lastLine = child ? `${child.relation}今年${child.education?.grade || '在读'}` : latestEvent?.title || ''
                  return (
                    <li key={f.id}>
                      <Link
                        to={`/friends/${f.id}`}
                        className="flex gap-3 px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 active:bg-gray-100"
                      >
                        <div className="w-12 h-12 rounded-full bg-primary/20 overflow-hidden flex items-center justify-center text-primary text-lg font-medium flex-shrink-0">
                          {f.avatarUrl ? (
                            <img src={f.avatarUrl} alt={`${f.name}头像`} className="w-full h-full object-cover" />
                          ) : (
                            <span>{f.name.slice(0, 1)}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-text">{f.name}</span>
                            <span className="text-amber-500 text-xs">{'★'.repeat(f.intimacyLevel)}</span>
                          </div>
                          {subtitle && <div className="text-sm text-text-secondary">{subtitle}</div>}
                          {lastLine && <div className="text-sm text-text-hint truncate">{lastLine}</div>}
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  )
}
