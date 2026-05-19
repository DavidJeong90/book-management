// src/lib/api.ts
// Spring Boot REST API 클라이언트
// NEXT_PUBLIC_API_URL 환경변수로 서버 주소 주입

import { Book, BookRequest, ServerInfo } from '@/types/book'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

// ── 공통 fetch 래퍼 ──────────────────────────────────────────
async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const url  = `${BASE_URL}${path}`
  const res  = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }))
    throw new Error((err as { message?: string }).message ?? `HTTP ${res.status}`)
  }

  // 204 No Content (DELETE)
  if (res.status === 204) return null as T
  return res.json() as Promise<T>
}

// ── CRUD API ──────────────────────────────────────────────────
export const bookApi = {
  // 전체 조회
  getAll: (): Promise<Book[]> =>
    fetchApi<Book[]>('/api/books'),

  // 단건 조회
  getById: (id: number): Promise<Book> =>
    fetchApi<Book>(`/api/books/${id}`),

  // 생성
  create: (data: BookRequest): Promise<Book> =>
    fetchApi<Book>('/api/books', {
      method: 'POST',
      body:   JSON.stringify(data),
    }),

  // 수정
  update: (id: number, data: BookRequest): Promise<Book> =>
    fetchApi<Book>(`/api/books/${id}`, {
      method: 'PUT',
      body:   JSON.stringify(data),
    }),

  // 삭제
  delete: (id: number): Promise<void> =>
    fetchApi<void>(`/api/books/${id}`, { method: 'DELETE' }),
}

// ── 서버 정보 조회 (로드밸런싱 확인용) ──────────────────────
export const serverApi = {
  getInfo: (): Promise<ServerInfo> =>
    fetchApi<ServerInfo>('/api/server-info'),
}
