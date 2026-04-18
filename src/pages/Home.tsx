import { Link } from 'react-router-dom'
import { store, getRecentUpdates } from '../store'

export default function Home() {
  const user = store.getUser()
  const friends = store.getFriends()
  const events = store.getEvents()
  const upcoming = store.getUpcomingEvents(7)
  const recent = getRecentUpdates(friends, events, 5)
  const reminderCount = upcoming.length

  return (
    <div className="pb-4">
      <header className="bg-primary text-white px-4 py-6 rounded-b-2xl">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">友记</h1>
          <Link to="/me" className="p-1 rounded-full hover:bg-white/20">⚙️</Link>
        </div>
        <p className="mt-3 text-white/90 text-sm">你好，{user.nickname}</p>
        {reminderCount > 0 && (
          <p className="mt-1 text-white/80 text-sm">今天有 {reminderCount} 个提醒待查看</p>
        )}
      </header>

      <section className="px-4 -mt-2">
        <div className="bg-card rounded-2xl shadow-sm p-4">
          <h2 className="text-base font-medium text-text mb-3">近期事件</h2>
          {upcoming.length === 0 ? (
            <p className="text-text-hint text-sm py-4">暂无即将到来的事件</p>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1">
              {upcoming.slice(0, 5).map((e) => {
                const friend = store.getFriend(e.friendId)
                const d = e.eventDate
                const md = d.slice(5).replace('-', '/')
                return (
                  <Link
                    key={e.id}
                    to={`/friends/${e.friendId}`}
                    className="flex-shrink-0 w-24 rounded-xl bg-bg border border-gray-100 p-3 text-center"
                  >
                    <div className="text-primary font-medium text-sm">{md}</div>
                    <div className="text-text text-xs mt-1 truncate">{e.title}</div>
                    <div className="text-text-hint text-xs mt-0.5 truncate">{friend?.name || ''}</div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 mt-4">
        <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
          <h2 className="text-base font-medium text-text px-4 pt-4 pb-2">最近更新</h2>
          {recent.length === 0 ? (
            <p className="text-text-hint text-sm px-4 pb-6">添加朋友并记录动态后这里会显示</p>
          ) : (
            <ul>
              {recent.map(({ friend, event, summary }) => (
                <li key={friend.id}>
                  <Link
                    to={`/friends/${friend.id}`}
                    className="flex gap-3 px-4 py-3 border-t border-gray-100 hover:bg-gray-50 active:bg-gray-100"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/20 overflow-hidden flex items-center justify-center text-primary font-medium flex-shrink-0">
                      {friend.avatarUrl ? (
                        <img src={friend.avatarUrl} alt={`${friend.name}头像`} className="w-full h-full object-cover" />
                      ) : (
                        <span>{friend.name.slice(0, 1)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-text">{friend.name}</div>
                      <div className="text-sm text-text-secondary truncate">{summary}</div>
                      <div className="text-xs text-text-hint mt-0.5">
                        {event?.updatedAt?.slice(0, 10) || friend.updatedAt?.slice(0, 10)} 更新
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
