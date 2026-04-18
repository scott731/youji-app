// 朋友
export interface Friend {
  id: string
  name: string
  nickname?: string
  avatarUrl?: string
  groupId?: string
  groupName?: string
  intimacyLevel: 1 | 2 | 3 | 4 | 5
  knowDate?: string
  knowSource?: string
  phone?: string
  wechat?: string
  email?: string
  address?: string
  company?: string
  position?: string
  industry?: string
  workStartDate?: string
  birthday?: string
  birthdayType?: 0 | 1 // 0公历 1农历
  bloodType?: string
  hobbies?: string[]
  dietPreferences?: string[]
  taboos?: string
  notes?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

// 家庭成员
export interface FamilyMember {
  id: string
  friendId: string
  relation: string // 配偶/儿子/女儿/父亲/母亲等
  name: string
  gender?: 0 | 1 | 2
  birthday?: string
  occupation?: string
  phone?: string
  notes?: string
  education?: EducationInfo
  createdAt: string
  updatedAt: string
}

// 教育信息
export interface EducationInfo {
  id?: string
  schoolName?: string
  schoolType?: string // 幼儿园/小学/初中/高中/大学/研究生
  major?: string
  degree?: string
  grade?: string
  startDate?: string
  endDate?: string
  status?: 0 | 1 | 2 // 在读/毕业/休学
  graduateDestination?: string
  notes?: string
}

// 事件
export interface EventItem {
  id: string
  friendId: string
  eventType: string
  eventDate: string
  title: string
  description?: string
  hasReminder: boolean
  remindTime?: string
  remindCycle?: string
  createdAt: string
  updatedAt: string
}

// 礼金记录
export interface GiftRecord {
  id: string
  friendId: string
  eventType: string
  eventDate: string
  direction: 1 | 2 // 1收入 2支出
  amount: number
  notes?: string
  createdAt: string
  updatedAt: string
}

// 分组
export interface Group {
  id: string
  name: string
  icon?: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}
