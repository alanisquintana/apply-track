import type { Application, CreateApplicationPayload, UpdateApplicationPayload } from '../types/application'

const API = import.meta.env.VITE_API_URL ?? ''
const BASE = `${API}/api/applications`

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? `Request failed (${res.status})`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export function getAll(): Promise<Application[]> {
  return request<Application[]>(BASE)
}

export function getById(id: string): Promise<Application> {
  return request<Application>(`${BASE}/${id}`)
}

export function create(data: CreateApplicationPayload): Promise<Application> {
  return request<Application>(BASE, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function update(id: string, data: UpdateApplicationPayload): Promise<Application> {
  return request<Application>(`${BASE}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function remove(id: string): Promise<void> {
  return request<void>(`${BASE}/${id}`, { method: 'DELETE' })
}
