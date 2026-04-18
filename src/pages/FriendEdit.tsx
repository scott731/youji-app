import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect, useRef, type ChangeEvent } from 'react'
import { store } from '../store'
import type { Friend } from '../types'

const MAX_UPLOAD_SIZE = 12 * 1024 * 1024

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('读取图片失败'))
    reader.readAsDataURL(file)
  })
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('解析图片失败'))
    img.src = dataUrl
  })
}

async function compressImage(file: File): Promise<string> {
  const dataUrl = await readFileAsDataUrl(file)
  const img = await loadImage(dataUrl)

  const maxEdge = 640
  const scale = Math.min(1, maxEdge / Math.max(img.width, img.height))
  const width = Math.max(1, Math.round(img.width * scale))
  const height = Math.max(1, Math.round(img.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) return dataUrl

  ctx.drawImage(img, 0, 0, width, height)
  return canvas.toDataURL('image/jpeg', 0.8)
}

export default function FriendEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = !id
  const existing = id ? store.getFriend(id) : null
  const groups = store.getGroups()

  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
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
  const [avatarError, setAvatarError] = useState('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (existing) {
      setName(existing.name)
      setNickname(existing.nickname || '')
      setAvatarUrl(existing.avatarUrl || '')
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

  const handlePickAvatar = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setAvatarError('请选择图片文件')
      e.target.value = ''
      return
    }
    if (file.size > MAX_UPLOAD_SIZE) {
      setAvatarError('图片过大，请选择 12MB 以内的图片')
      e.target.value = ''
      return
    }
    try {
      const compressed = await compressImage(file)
      setAvatarUrl(compressed)
      setAvatarError('')
    } catch (_) {
      setAvatarError('图片处理失败，请换一张试试')
    }
    e.target.value = ''
  }

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
      avatarUrl: avatarUrl || undefined,
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
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handlePickAvatar}
              className="w-24 h-24 rounded-full bg-primary/20 overflow-hidden flex items-center justify-center text-primary text-3xl font-medium"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="头像预览" className="w-full h-full object-cover" />
              ) : (
                <span>{name.slice(0, 1) || '?'}</span>
              )}
            </button>
            <div className="flex gap-2 text-xs">
              <button type="button" onClick={handlePickAvatar} className="text-primary">上传头像</button>
              {avatarUrl && (
                <button type="button" onClick={() => setAvatarUrl('')} className="text-text-secondary">移除</button>
              )}
            </div>
            <p className="text-text-hint text-xs">支持相册/本地文件，上传后自动压缩</p>
            {avatarError && <p className="text-red-500 text-xs">{avatarError}</p>}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
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
