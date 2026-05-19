'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { bookApi, serverApi } from '@/lib/api'
import { Book, BookRequest, ServerInfo } from '@/types/book'
import BookCard from '@/components/BookCard'
import BookForm from '@/components/BookForm'

export default function HomePage() {
  const [books,       setBooks]       = useState<Book[]>([])
  const [serverInfo,  setServerInfo]  = useState<ServerInfo | null>(null)
  const [prevIp,      setPrevIp]      = useState<string>('')
  const [lbAlert,     setLbAlert]     = useState(false)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState<string | null>(null)
  const [successMsg,  setSuccessMsg]  = useState<string | null>(null)
  const [showForm,    setShowForm]    = useState(false)
  const [editBook,    setEditBook]    = useState<Book | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── 도서 목록 로드 ────────────────────────────────────────
  const loadBooks = useCallback(async () => {
    try {
      const data = await bookApi.getAll()
      setBooks(data)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : '서버 연결 오류')
    } finally {
      setLoading(false)
    }
  }, [])

  // ── 서버 정보 갱신 (10초마다) ────────────────────────────
  const refreshServerInfo = useCallback(async () => {
    try {
      const info = await serverApi.getInfo()
      setServerInfo(info)
      if (prevIp && prevIp !== info.serverIp) {
        setLbAlert(true)
        setTimeout(() => setLbAlert(false), 5000)
      }
      setPrevIp(info.serverIp)
    } catch {
      // 서버 정보 실패는 무시
    }
  }, [prevIp])

  useEffect(() => {
    loadBooks()
    refreshServerInfo()
    timerRef.current = setInterval(refreshServerInfo, 10_000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [loadBooks, refreshServerInfo])

  // ── 알림 표시 헬퍼 ───────────────────────────────────────
  const showSuccess = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  // ── CRUD 핸들러 ───────────────────────────────────────────
  const handleCreate = async (req: BookRequest) => {
    await bookApi.create(req)
    setShowForm(false)
    showSuccess('도서가 등록되었습니다.')
    loadBooks()
  }

  const handleUpdate = async (req: BookRequest) => {
    if (!editBook) return
    await bookApi.update(editBook.id, req)
    setEditBook(null)
    showSuccess('도서가 수정되었습니다.')
    loadBooks()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return
    await bookApi.delete(id)
    showSuccess('도서가 삭제되었습니다.')
    loadBooks()
  }

  // ── 렌더링 ────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gray-50">

      {/* 헤더 */}
      <header className="bg-white border-b-2 border-orange-400 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-orange-500">도서1</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              도서1 내용
            </p>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditBook(null) }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium
                       px-4 py-2 rounded-lg transition-colors"
          >
            + 새 도서
          </button>
        </div>
      </header>

      {/* 서버 정보 배너 — 로드밸런싱 시각화 */}
      <div className="bg-slate-800 text-slate-200 px-4 py-2 text-xs flex flex-wrap gap-4 items-center">
        <span>
          🖥 응답 서버 IP:{' '}
          <span className="font-mono font-bold text-yellow-300">
            {serverInfo?.serverIp ?? '조회 중...'}
          </span>
        </span>
        <span>📍 {serverInfo?.hostname ?? '—'}</span>
        {lbAlert && (
          <span className="bg-green-500 text-white px-2 py-0.5 rounded-full animate-pulse font-semibold">
            🔀 LB 전환 감지!
          </span>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">

        {/* 오류 메시지 */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 text-sm p-4 rounded-lg">
            ❌ {error}
          </div>
        )}

        {/* 성공 메시지 */}
        {successMsg && (
          <div className="bg-green-50 border-l-4 border-green-400 text-green-700 text-sm p-4 rounded-lg">
            ✅ {successMsg}
          </div>
        )}

        {/* 생성 폼 */}
        {showForm && (
          <BookForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* 수정 폼 */}
        {editBook && (
          <BookForm
            initialData={editBook}
            onSubmit={handleUpdate}
            onCancel={() => setEditBook(null)}
          />
        )}

        {/* 목록 */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">로딩 중...</div>
        ) : books.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-base">도서가 없습니다.</p>
            <p className="text-sm mt-1">새 도서 버튼을 눌러 시작하세요.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {books.map(book => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={() => { setEditBook(book); setShowForm(false) }}
                onDelete={() => handleDelete(book.id)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
