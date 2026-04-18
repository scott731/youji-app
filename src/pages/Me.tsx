import { useState } from 'react'
import { store } from '../store'

export default function Me() {
  const user = store.getUser()
  const [nickname, setNickname] = useState(user.nickname)
  const [saved, setSaved] = useState(false)
  const friends = store.getFriends()
  const events = store.getEvents()
  const gifts = store.getGifts()

  const handleSaveNickname = () => {
    store.setUser({ nickname: nickname.trim() || '用户' })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleExport = () => {
    const data = {
      exportAt: new Date().toISOString(),
      user: store.getUser(),
      friends: store.getFriends(),
      family: store.getFamily(),
      events: store.getEvents(),
      gifts: store.getGifts(),
      groups: store.getGroups(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `友记备份_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="pb-4">
      <header className="bg-primary text-white px-4 py-8 rounded-b-2xl">
        <h1 className="text-xl font-bold">我的</h1>
        <p className="mt-2 text-white/90 text-sm">设置与数据管理</p>
      </header>

      <div className="px-4 -mt-2 space-y-4">
        <section className="bg-card rounded-2xl shadow-sm p-4">
          <h2 className="text-base font-medium text-text mb-3">个人信息</h2>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-medium">
              {user.nickname.slice(0, 1)}
            </div>
            <div className="flex-1">
              <label className="block text-sm text-text-secondary mb-1">昵称（首页问候语）</label>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onBlur={handleSaveNickname}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="如：张三"
              />
            </div>
          </div>
          {saved && <p className="text-success text-sm mt-2">已保存</p>}
        </section>

        <section className="bg-card rounded-2xl shadow-sm overflow-hidden">
          <h2 className="text-base font-medium text-text px-4 pt-4 pb-2">数据概览</h2>
          <ul className="divide-y divide-gray-100">
            <li className="px-4 py-3 flex justify-between">
              <span className="text-text-secondary">朋友数量</span>
              <span className="font-medium">{friends.length}</span>
            </li>
            <li className="px-4 py-3 flex justify-between">
              <span className="text-text-secondary">事件记录</span>
              <span className="font-medium">{events.length}</span>
            </li>
            <li className="px-4 py-3 flex justify-between">
              <span className="text-text-secondary">礼金记录</span>
              <span className="font-medium">{gifts.length}</span>
            </li>
          </ul>
        </section>

        <section className="bg-card rounded-2xl shadow-sm overflow-hidden">
          <h2 className="text-base font-medium text-text px-4 pt-4 pb-2">数据管理</h2>
          <div className="p-4 space-y-2">
            <button
              onClick={handleExport}
              className="w-full py-3 rounded-xl border border-gray-200 text-text hover:bg-gray-50 text-left px-4"
            >
              导出备份（JSON）
            </button>
            <p className="text-xs text-text-hint">
              数据保存在浏览器本地，导出后可备份到电脑。更换设备或清除浏览器数据前请先导出备份。
            </p>
          </div>
        </section>

        <section className="text-center py-8 text-text-hint text-sm">
          <p>友记 · 让每一份友谊都被用心记住</p>
          <p className="mt-1">V1.0 · 本地版</p>
        </section>
      </div>
    </div>
  )
}
