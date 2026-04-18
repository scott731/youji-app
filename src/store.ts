import type { Friend, FamilyMember, EventItem, GiftRecord, Group } from './types'

const STORAGE_KEYS = {
  friends: 'youji_friends',
  family: 'youji_family',
  events: 'youji_events',
  gifts: 'youji_gifts',
  groups: 'youji_groups',
  user: 'youji_user',
} as const

function load<T>(key: string, defaultValue: T): T {
  try {
    const s = localStorage.getItem(key)
    if (s) return JSON.parse(s) as T
  } catch (_) {}
  return defaultValue
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (_) {}
}

// 默认分组
const DEFAULT_GROUPS: Group[] = [
  { id: 'g1', name: '家人', sortOrder: 1, createdAt: '', updatedAt: '' },
  { id: 'g2', name: '亲戚', sortOrder: 2, createdAt: '', updatedAt: '' },
  { id: 'g3', name: '同学', sortOrder: 3, createdAt: '', updatedAt: '' },
  { id: 'g4', name: '同事', sortOrder: 4, createdAt: '', updatedAt: '' },
  { id: 'g5', name: '前同事', sortOrder: 5, createdAt: '', updatedAt: '' },
  { id: 'g6', name: '朋友', sortOrder: 6, createdAt: '', updatedAt: '' },
  { id: 'g7', name: '邻居', sortOrder: 7, createdAt: '', updatedAt: '' },
  { id: 'g8', name: '客户', sortOrder: 8, createdAt: '', updatedAt: '' },
  { id: 'g9', name: '其他', sortOrder: 9, createdAt: '', updatedAt: '' },
]

function now() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export const store = {
  getFriends(): Friend[] {
    return load(STORAGE_KEYS.friends, [])
  },
  setFriends(list: Friend[]) {
    save(STORAGE_KEYS.friends, list)
  },
  getFriend(id: string): Friend | undefined {
    return this.getFriends().find((f) => f.id === id)
  },
  saveFriend(f: Friend) {
    const list = this.getFriends()
    const idx = list.findIndex((x) => x.id === f.id)
    f.updatedAt = now()
    if (idx >= 0) list[idx] = f
    else {
      f.createdAt = f.updatedAt
      list.push(f)
    }
    this.setFriends(list)
    return f
  },
  deleteFriend(id: string) {
    const list = this.getFriends().filter((x) => x.id !== id)
    this.setFriends(list)
    const family = this.getFamilyByFriendId(id)
    family.forEach((m) => this.deleteFamilyMember(m.id))
    this.getEvents().filter((e) => e.friendId === id).forEach((e) => this.deleteEvent(e.id))
    this.getGifts().filter((g) => g.friendId === id).forEach((g) => this.deleteGift(g.id))
  },

  getFamily(): FamilyMember[] {
    return load(STORAGE_KEYS.family, [])
  },
  setFamily(list: FamilyMember[]) {
    save(STORAGE_KEYS.family, list)
  },
  getFamilyByFriendId(friendId: string): FamilyMember[] {
    return this.getFamily().filter((m) => m.friendId === friendId)
  },
  saveFamilyMember(m: FamilyMember) {
    const list = this.getFamily()
    const idx = list.findIndex((x) => x.id === m.id)
    m.updatedAt = now()
    if (idx >= 0) list[idx] = m
    else {
      m.id = m.id || uid()
      m.createdAt = m.updatedAt
      list.push(m)
    }
    this.setFamily(list)
    return m
  },
  deleteFamilyMember(id: string) {
    this.setFamily(this.getFamily().filter((m) => m.id !== id))
  },

  getEvents(): EventItem[] {
    return load(STORAGE_KEYS.events, [])
  },
  setEvents(list: EventItem[]) {
    save(STORAGE_KEYS.events, list)
  },
  getEvent(id: string): EventItem | undefined {
    return this.getEvents().find((e) => e.id === id)
  },
  saveEvent(e: EventItem) {
    const list = this.getEvents()
    const idx = list.findIndex((x) => x.id === e.id)
    e.updatedAt = now()
    if (idx >= 0) list[idx] = e
    else {
      e.id = e.id || uid()
      e.createdAt = e.updatedAt
      list.push(e)
    }
    this.setEvents(list)
    return e
  },
  deleteEvent(id: string) {
    this.setEvents(this.getEvents().filter((e) => e.id !== id))
  },
  getEventsByFriendId(friendId: string): EventItem[] {
    return this.getEvents().filter((e) => e.friendId === friendId).sort((a, b) => (b.eventDate > a.eventDate ? 1 : -1))
  },
  getUpcomingEvents(days = 7): EventItem[] {
    const today = new Date().toISOString().slice(0, 10)
    const end = new Date()
    end.setDate(end.getDate() + days)
    const endStr = end.toISOString().slice(0, 10)
    return this.getEvents()
      .filter((e) => e.eventDate >= today && e.eventDate <= endStr && e.hasReminder)
      .sort((a, b) => (a.eventDate > b.eventDate ? 1 : -1))
  },

  getGifts(): GiftRecord[] {
    return load(STORAGE_KEYS.gifts, [])
  },
  setGifts(list: GiftRecord[]) {
    save(STORAGE_KEYS.gifts, list)
  },
  saveGift(g: GiftRecord) {
    const list = this.getGifts()
    const idx = list.findIndex((x) => x.id === g.id)
    g.updatedAt = now()
    if (idx >= 0) list[idx] = g
    else {
      g.id = g.id || uid()
      g.createdAt = g.updatedAt
      list.push(g)
    }
    this.setGifts(list)
    return g
  },
  deleteGift(id: string) {
    this.setGifts(this.getGifts().filter((g) => g.id !== id))
  },
  getGiftsByFriendId(friendId: string): GiftRecord[] {
    return this.getGifts().filter((g) => g.friendId === friendId).sort((a, b) => (b.eventDate > a.eventDate ? 1 : -1))
  },
  getGiftBalance(friendId: string): number {
    const list = this.getGiftsByFriendId(friendId)
    return list.reduce((sum, g) => sum + (g.direction === 2 ? -g.amount : g.amount), 0)
  },

  getGroups(): Group[] {
    const saved = load<Group[]>(STORAGE_KEYS.groups, [])
    if (saved.length === 0) {
      const withTime = DEFAULT_GROUPS.map((g) => ({ ...g, createdAt: now(), updatedAt: now() }))
      save(STORAGE_KEYS.groups, withTime)
      return withTime
    }
    return saved
  },
  setGroups(list: Group[]) {
    save(STORAGE_KEYS.groups, list)
  },

  getUser(): { nickname: string } {
    return load(STORAGE_KEYS.user, { nickname: '用户' })
  },
  setUser(u: { nickname: string }) {
    save(STORAGE_KEYS.user, u)
  },
}

export function getRecentUpdates(friends: Friend[], events: EventItem[], limit = 5): Array<{ friend: Friend; event?: EventItem; summary: string }> {
  const byFriend = new Map<string, EventItem[]>()
  for (const e of events) {
    if (!byFriend.has(e.friendId)) byFriend.set(e.friendId, [])
    byFriend.get(e.friendId)!.push(e)
  }
  const result: Array<{ friend: Friend; event?: EventItem; summary: string }> = []
  const sorted = [...friends].sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1))
  for (const friend of sorted) {
    if (result.length >= limit) break
    const evts = (byFriend.get(friend.id) || []).sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1))
    const latest = evts[0]
    let summary = friend.notes ? friend.notes.slice(0, 30) : (latest ? latest.title : '暂无动态')
    if (friend.notes && friend.notes.length > 30) summary += '...'
    result.push({ friend, event: latest, summary })
  }
  return result
}
