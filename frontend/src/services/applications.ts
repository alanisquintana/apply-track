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

async function requestWithRetry<T>(url: string, options?: RequestInit, retries = 8): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await request<T>(url, options)
    } catch (e) {
      if (i === retries - 1) throw e
      await new Promise(r => setTimeout(r, 400 * (i + 1)))
    }
  }
  throw new Error('Request failed after retries')
}

export function getAll(): Promise<Application[]> {
  return requestWithRetry<Application[]>(BASE)
}

export function getById(id: string): Promise<Application> {
  return request<Application>(`${BASE}/${id}`)
}

export function create(data: CreateApplicationPayload): Promise<Application> {
  return requestWithRetry<Application>(BASE, {
    method: 'POST',
    body: JSON.stringify(data),
  }, 5)
}

export function update(id: string, data: UpdateApplicationPayload): Promise<Application> {
  return requestWithRetry<Application>(`${BASE}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }, 5)
}

export function remove(id: string): Promise<void> {
  return requestWithRetry<void>(`${BASE}/${id}`, { method: 'DELETE' }, 5)
}
