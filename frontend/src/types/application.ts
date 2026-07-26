export type ApplicationStatus = 'applied' | 'interviewing' | 'offer' | 'rejected'
export type WorkModel = 'remote' | 'hybrid' | 'on-site'

export interface Application {
  id: string
  company: string
  role: string
  status: ApplicationStatus
  appliedAt: string
  description: string | null
  interviewDate: string | null
  interviewTime: string | null
  link: string | null
  appliedWhere: string | null
  logoUrl: string | null
  salaryMin: number | null
  salaryMax: number | null
  recruiterLink: string | null
  workModel: WorkModel | null
  interviewLink: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateApplicationPayload {
  company: string
  role: string
  status?: ApplicationStatus
  appliedAt: string
  description?: string
  interviewDate?: string
  interviewTime?: string
  link?: string
  appliedWhere?: string
  logoUrl?: string
  salaryMin?: number
  salaryMax?: number
  recruiterLink?: string
  workModel?: WorkModel
  interviewLink?: string
}

export interface UpdateApplicationPayload {
  company?: string
  role?: string
  status?: ApplicationStatus
  appliedAt?: string
  description?: string
  interviewDate?: string
  interviewTime?: string
  link?: string
  appliedWhere?: string
  logoUrl?: string
  salaryMin?: number
  salaryMax?: number
  recruiterLink?: string
  workModel?: WorkModel
  interviewLink?: string
}
