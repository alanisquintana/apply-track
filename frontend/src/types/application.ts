export type ApplicationStatus = 'applied' | 'interviewing' | 'offer' | 'rejected'

export interface Application {
  id: string
  company: string
  role: string
  status: ApplicationStatus
  appliedAt: string
  createdAt: string
  updatedAt: string
}

export interface CreateApplicationPayload {
  company: string
  role: string
  status?: ApplicationStatus
  appliedAt: string
}

export interface UpdateApplicationPayload {
  company?: string
  role?: string
  status?: ApplicationStatus
  appliedAt?: string
}
