import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { store } from '../store'
import type { Friend } from '../types'

export default function FriendEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = !id
  const existing = id ? store.getFriend(id) : null
  const groups = store.getGroups()

  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [groupId, setGroupId] = useState('')
  const [intimacyLevel, setIntimacyLevel] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [knowDate, setKnowDate] = useState('')
  const [knowSource, setKnowSource] = useState('')
  const [phone, setPhone] = useState('')
  const [wechat, setWechat] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [company, setCompany] = useState('')
  const [position, setPosition] = useState('')
  const [industry, setIndustry] = useState('')
  const [workStartDate, setWorkStartDate] = useState('')
  const [birthday, setBirthday] = useState('')
  const [hobbies, setHobbies] = useState('')
  const [taboos, setTaboos] = useState('')
  const [notes, setNotes] = useState('')
  const [tags, setTags] = useState('')

  useEffect(() => {
    if (existing) {
      setName(existing.name)
      setNickname(existing.nickname || '')
      setGroupId(existing.groupId || '')
      setIntimacyLevel(existing.intimacyLevel)
      setKnowDate(existing.knowDate?.slice(0, 10) || '')
      setKnowSource(existing.knowSource || '')
      setPhone(existing.phone || '')
      setWechat(existing.wechat || '')
      setEmail(existing.email || '')
      setAddress(existing.address || '')
      setCompany(existing.company || '')
      setPosition(existing.position || '')
      setIndustry(existing.industry || '')
      setWorkStartDate(existing.workStartDate?.slice(0, 10) || '')
      setBirthday(existing.birthday?.slice(0, 10) || '')
      setHobbies((existing.hobbies || []).join('、'))
      setTaboos(existing.taboos || '')
      setNotes(existing.notes || '')
      setTags((existing.tags || []).join('、'))
    }
  }, [existing])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    const group = groups.find((g) => g.id === groupId)
    const friend: Friend = {
      ...(existing || {
        id: '',
        name: '',
        intimacyLevel: 3,
        createdAt: '',
        updatedAt: '',
      }),
      id: existing?.id || `f_${Date.now()}`,
      name: name.trim(),
      nickname: nickname.trim() || undefined,
      groupId: groupId || undefined,
      groupName: group?.name,
      intimacyLevel,
      knowDate: knowDate || undefined,
      knowSource: knowSource.trim() || undefined,
      phone: phone.trim() || undefined,
      wechat: wechat.trim() || undefined,
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      company: company.trim() || undefined,
      position: position.trim() || undefined,
      industry: industry.trim() || undefined,
      workStartDate: workStartDate || undefined,
      birthday: birthday || undefined,
      hobbies: hobbies.trim() ? hobbies.split(/[、,，]/).map((s) => s.trim()).filter(Boolean) : undefined,
      taboos: taboos.trim() || undefined,
      notes: notes.trim() || undefined,
      tags: tags.trim() ? tags.split(/[、,，]/).map((s) => s.trim()).filter(Boolean) : undefined,
      createdAt: existing?.createdAt || new Date().toISOString().slice(0, 19).replace('T', ' '),
      updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    }
    store.saveFriend(friend)
    if (isNew) navigate(`/friends/${friend.id}`)
    else navigate(-1)
  }

  return (
    <div className="min-h-screen bg-bg pb-8">
      <header className="sticky top-0 z-10 bg-card border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <Link to={isNew ? '/friends' : `/friends/${id}`} className="text-text-secondary">取消</Link>
        <span className="font-medium">{isNew ? '添加朋友' : '编辑朋友'}</span>
        <button type="submit" form="friend-form" className="text-primary font-medium">保存</button>
      </header>

      <form id="friend-form" onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="flex justify-center py-6">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-medium">
            {name.slice(0, 1) || '?'}
          </div>
        </div>

        <Section title="基础信息">
          <Input label="姓名 *" value={name} onChange={setName} required placeholder="必填" />
          <Input label="昵称/别名" value={nickname} onChange={setNickname} placeholder="便于记忆的称呼" />
          <div>
            <label className="block text-sm text-text-secondary mb-1">分组</label>
            <select value={groupId} onChange={(e) => setGroupId(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white">
              <option value="">请选择</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <Input label="认识时间" type="date" value={knowDate} onChange={setKnowDate} />
          <Input label="认识途径" value={knowSource} onChange={setKnowSource} placeholder="如何认识的" />
          <div>
            <label className="block text-sm text-text-secondary mb-1">亲密度</label>
            <div className="flex gap-1">
              {([1, 2, 3, 4, 5] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setIntimacyLevel(n)}
                  className={`w-10 h-10 rounded-lg ${intimacyLevel >= n ? 'bg-amber-400 text-white' : 'bg-gray-100 text-text-secondary'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        </Section>

        <Section title="联系方式">
          <Input label="手机号" value={phone} onChange={setPhone} />
          <Input label="微信号" value={wechat} onChange={setWechat} />
          <Input label="邮箱" value={email} onChange={setEmail} />
          <Input label="住址" value={address} onChange={setAddress} />
        </Section>

        <Section title="职业信息">
          <Input label="工作单位" value={company} onChange={setCompany} />
          <Input label="职位" value={position} onChange={setPosition} />
          <Input label="行业" value={industry} onChange={setIndustry} />
          <Input label="入职时间" type="date" value={workStartDate} onChange={setWorkStartDate} />
        </Section>

        <Section title="个人特征">
          <Input label="生日" type="date" value={birthday} onChange={setBirthday} />
          <Input label="兴趣爱好" value={hobbies} onChange={setHobbies} placeholder="多个用顿号分隔" />
          <Input label="忌讳事项" value={taboos} onChange={setTaboos} placeholder="需要注意的事项" />
        </Section>

        <Section title="备注">
          <div>
            <label className="block text-sm text-text-secondary mb-1">个人简介/备注</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" rows={3} placeholder="自由记录" />
          </div>
          <Input label="标签" value={tags} onChange={setTags} placeholder="多个用顿号分隔，如：大学同学、球友" />
        </Section>
      </form>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-text-secondary border-b border-gray-100">
        {title}
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  )
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm text-text-secondary mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
        placeholder={placeholder}
        required={required}
      />
    </div>
  )
}
