export type ApplicationStatus = 'applied' | 'interviewing' | 'offer' | 'rejected'

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
}
