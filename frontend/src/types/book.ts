// src/types/book.ts

export interface Book {
  id:        number
  title:     string
  content:   string
  author:    string
  price:     number
  available: boolean
  serverIp:  string       // 응답 서버 IP (로드밸런싱 확인용)
  createdAt: string
  updatedAt: string
}

export interface BookRequest {
  title:   string
  content: string
  author:  string
  price:     number
  available: boolean
}

export interface ServerInfo {
  serverIp:  string
  hostname:  string
  timestamp: string
  message:   string
}
