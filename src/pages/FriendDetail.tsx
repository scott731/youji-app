import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { store } from '../store'
import type { FamilyMember, EventItem, GiftRecord, Friend } from '../types'

type Tab = 'overview' | 'family' | 'events' | 'gifts'

export default function FriendDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('overview')
  const friend = id ? store.getFriend(id) : null
  const family = friend ? store.getFamilyByFriendId(friend.id) : []
  const events = friend ? store.getEventsByFriendId(friend.id) : []
  const gifts = friend ? store.getGiftsByFriendId(friend.id) : []
  const balance = friend ? store.getGiftBalance(friend.id) : 0

  if (!friend) {
    return (
      <div className="p-8 text-center">
        <p className="text-text-secondary">未找到该朋友</p>
        <Link to="/friends" className="text-primary mt-4 inline-block">返回列表</Link>
      </div>
    )
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: '概况' },
    { key: 'family', label: '家庭' },
    { key: 'events', label: '事件' },
    { key: 'gifts', label: '礼金' },
  ]

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-10 bg-card border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1">← 返回</button>
        <span className="font-medium">朋友详情</span>
        <Link to={`/friends/${friend.id}/edit`} className="text-primary text-sm">编辑</Link>
      </header>

      <div className="px-4 pt-6 pb-4 bg-card">
        <div className="flex justify-center mb-2">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-medium">
            {friend.name.slice(0, 1)}
          </div>
        </div>
        <h2 className="text-xl font-bold text-center text-text">{friend.name}</h2>
        <div className="flex justify-center gap-1 mt-1 text-amber-500 text-sm">{'★'.repeat(friend.intimacyLevel)}</div>
        <p className="text-center text-text-secondary text-sm mt-1">
          {friend.groupName || '未分组'}
          {friend.knowDate && ` · 认识 ${Math.floor((Date.now() - new Date(friend.knowDate).getTime()) / (365 * 24 * 60 * 60 * 1000))} 年`}
        </p>
      </div>

      <div className="flex border-b border-gray-200 bg-card">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-3 text-sm font-medium ${tab === key ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {tab === 'overview' && <OverviewTab friend={friend} />}
        {tab === 'family' && <FamilyTab friendId={friend.id} members={family} />}
        {tab === 'events' && <EventsTab friendId={friend.id} events={events} />}
        {tab === 'gifts' && <GiftsTab friendId={friend.id} records={gifts} balance={balance} />}
      </div>
    </div>
  )
}

function OverviewTab({ friend }: { friend: Friend }) {
  return (
    <div className="space-y-4">
      <Card title="基本信息">
        {friend.birthday && <Row label="生日" value={friend.birthday} />}
        {friend.phone && <Row label="手机" value={friend.phone} />}
        {friend.wechat && <Row label="微信" value={friend.wechat} />}
        {friend.email && <Row label="邮箱" value={friend.email} />}
        {friend.address && <Row label="住址" value={friend.address} />}
        {!friend.birthday && !friend.phone && !friend.wechat && !friend.email && !friend.address && (
          <p className="text-text-hint text-sm">暂无基本信息</p>
        )}
      </Card>
      <Card title="职业信息">
        {friend.company && <Row label="公司" value={friend.company} />}
        {friend.position && <Row label="职位" value={friend.position} />}
        {friend.industry && <Row label="行业" value={friend.industry} />}
        {friend.workStartDate && <Row label="入职时间" value={friend.workStartDate} />}
        {!friend.company && !friend.position && <p className="text-text-hint text-sm">暂无职业信息</p>}
      </Card>
      {friend.tags && friend.tags.length > 0 && (
        <div>
          <div className="text-sm text-text-secondary mb-2">标签</div>
          <div className="flex flex-wrap gap-2">
            {friend.tags.map((t) => (
              <span key={t} className="px-2 py-1 rounded-full bg-gray-100 text-sm">{t}</span>
            ))}
          </div>
        </div>
      )}
      {friend.notes && (
        <Card title="备注">
          <p className="text-sm text-text whitespace-pre-wrap">{friend.notes}</p>
        </Card>
      )}
    </div>
  )
}

function FamilyTab({ friendId, members }: { friendId: string; members: FamilyMember[] }) {
  const [adding, setAdding] = useState(false)
  return (
    <div className="space-y-4">
      {members.map((m) => (
        <Card key={m.id} title={`${m.relation}${m.name ? ` · ${m.name}` : ''}`}>
          {m.birthday && <Row label="生日" value={m.birthday} />}
          {m.occupation && <Row label="职业/身份" value={m.occupation} />}
          {m.phone && <Row label="联系方式" value={m.phone} />}
          {m.education && (
            <>
              {m.education.schoolName && <Row label="学校" value={m.education.schoolName} />}
              {m.education.schoolType && <Row label="类型" value={m.education.schoolType} />}
              {m.education.grade && <Row label="年级" value={m.education.grade} />}
              {m.education.major && <Row label="专业" value={m.education.major} />}
            </>
          )}
          {m.notes && <p className="text-sm text-text mt-2">{m.notes}</p>}
        </Card>
      ))}
      <button
        onClick={() => setAdding(true)}
        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-text-secondary text-sm"
      >
        + 添加家庭成员
      </button>
      {adding && (
        <FamilyMemberForm
          friendId={friendId}
          onClose={() => setAdding(false)}
          onSaved={() => { setAdding(false); window.location.reload() }}
        />
      )}
    </div>
  )
}

function FamilyMemberForm({
  friendId,
  onClose,
  onSaved,
}: {
  friendId: string
  onClose: () => void
  onSaved: () => void
}) {
  const [relation, setRelation] = useState('儿子')
  const [name, setName] = useState('')
  const [birthday, setBirthday] = useState('')
  const [occupation, setOccupation] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [schoolType, setSchoolType] = useState('')
  const [grade, setGrade] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    store.saveFamilyMember({
      id: '',
      friendId,
      relation,
      name,
      birthday: birthday || undefined,
      occupation: occupation || undefined,
      notes: notes || undefined,
      education: schoolName || grade || schoolType ? { schoolName, schoolType, grade } : undefined,
      createdAt: '',
      updatedAt: '',
    })
    onSaved()
  }

  return (
    <form onSubmit={handleSubmit} className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-card w-full max-w-lg rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-medium mb-4">添加家庭成员</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-text-secondary mb-1">称谓</label>
            <select
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            >
              {['配偶', '儿子', '女儿', '父亲', '母亲', '其他'].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">姓名</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="选填" />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">生日</label>
            <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">职业/身份</label>
            <input value={occupation} onChange={(e) => setOccupation(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="如：学生、教师" />
          </div>
          <div className="border-t pt-3">
            <div className="text-sm font-medium text-text-secondary mb-2">子女教育（选填）</div>
            <input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2" placeholder="学校名称" />
            <input value={schoolType} onChange={(e) => setSchoolType(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2" placeholder="类型：幼儿园/小学/初中/高中/大学" />
            <input value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="年级" />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">备注</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" rows={2} />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onClose} className="flex-1 py-2 border border-gray-200 rounded-lg">取消</button>
          <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg">保存</button>
        </div>
      </div>
    </form>
  )
}

function EventsTab({ friendId, events }: { friendId: string; events: EventItem[] }) {
  const [adding, setAdding] = useState(false)
  return (
    <div className="space-y-4">
      {events.map((e) => (
        <Card key={e.id} title={e.title}>
          <Row label="类型" value={e.eventType} />
          <Row label="日期" value={e.eventDate} />
          {e.description && <p className="text-sm text-text mt-2">{e.description}</p>}
        </Card>
      ))}
      <button
        onClick={() => setAdding(true)}
        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-text-secondary text-sm"
      >
        + 添加事件
      </button>
      {adding && (
        <EventForm
          friendId={friendId}
          onClose={() => setAdding(false)}
          onSaved={() => { setAdding(false); window.location.reload() }}
        />
      )}
    </div>
  )
}

function EventForm({
  friendId,
  onClose,
  onSaved,
}: { friendId: string; onClose: () => void; onSaved: () => void }) {
  const [eventType, setEventType] = useState('生日')
  const [eventDate, setEventDate] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [hasReminder, setHasReminder] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    store.saveEvent({
      id: '',
      friendId,
      eventType,
      eventDate,
      title: title || eventType,
      description: description || undefined,
      hasReminder,
      createdAt: '',
      updatedAt: '',
    })
    onSaved()
  }

  const types = ['生日', '婚嫁', '生育', '升学', '毕业', '换工作', '升职', '乔迁', '纪念日', '其他']
  return (
    <form onSubmit={handleSubmit} className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-card w-full max-w-lg rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-medium mb-4">添加事件</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-text-secondary mb-1">事件类型</label>
            <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg">
              {types.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">日期 *</label>
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">标题</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="简短描述" />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">详情</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" rows={2} />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={hasReminder} onChange={(e) => setHasReminder(e.target.checked)} />
            <span className="text-sm">设置提醒</span>
          </label>
        </div>
        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onClose} className="flex-1 py-2 border border-gray-200 rounded-lg">取消</button>
          <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg">保存</button>
        </div>
      </div>
    </form>
  )
}

function GiftsTab({ friendId, records, balance }: { friendId: string; records: GiftRecord[]; balance: number }) {
  const [adding, setAdding] = useState(false)
  return (
    <div className="space-y-4">
      <Card title="往来差额">
        <p className="text-lg font-medium">{balance > 0 ? '对方多给' : balance < 0 ? '我多给' : '基本平衡'}</p>
        <p className="text-2xl font-bold text-primary">{Math.abs(balance).toFixed(0)} 元</p>
      </Card>
      {records.map((g) => (
        <Card key={g.id} title={g.eventType}>
          <Row label="日期" value={g.eventDate} />
          <Row label="方向" value={g.direction === 1 ? '收入' : '支出'} />
          <Row label="金额" value={`${g.amount} 元`} />
          {g.notes && <p className="text-sm text-text mt-2">{g.notes}</p>}
        </Card>
      ))}
      <button
        onClick={() => setAdding(true)}
        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-text-secondary text-sm"
      >
        + 添加礼金记录
      </button>
      {adding && (
        <GiftForm
          friendId={friendId}
          onClose={() => setAdding(false)}
          onSaved={() => { setAdding(false); window.location.reload() }}
        />
      )}
    </div>
  )
}

function GiftForm({ friendId, onClose, onSaved }: { friendId: string; onClose: () => void; onSaved: () => void }) {
  const [eventType, setEventType] = useState('婚礼')
  const [eventDate, setEventDate] = useState('')
  const [direction, setDirection] = useState<1 | 2>(2)
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const n = parseFloat(amount)
    if (isNaN(n) || n <= 0) return
    store.saveGift({
      id: '',
      friendId,
      eventType,
      eventDate,
      direction,
      amount: n,
      notes: notes || undefined,
      createdAt: '',
      updatedAt: '',
    })
    onSaved()
  }

  return (
    <form onSubmit={handleSubmit} className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-card w-full max-w-lg rounded-t-2xl p-6">
        <h3 className="text-lg font-medium mb-4">添加礼金记录</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-text-secondary mb-1">事件类型</label>
            <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg">
              {['婚礼', '满月', '寿宴', '丧事', '其他'].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">日期 *</label>
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">方向</label>
            <select value={direction} onChange={(e) => setDirection(Number(e.target.value) as 1 | 2)} className="w-full px-3 py-2 border border-gray-200 rounded-lg">
              <option value={1}>收入</option>
              <option value={2}>支出</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">金额 *</label>
            <input type="number" min="0" step="1" value={amount} onChange={(e) => setAmount(e.target.value)} required className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">备注</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onClose} className="flex-1 py-2 border border-gray-200 rounded-lg">取消</button>
          <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg">保存</button>
        </div>
      </div>
    </form>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-xl shadow-sm p-4">
      <h3 className="text-sm font-medium text-text-secondary mb-3">{title}</h3>
      {children}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm py-1">
      <span className="text-text-secondary">{label}</span>
      <span className="text-text">{value}</span>
    </div>
  )
}
