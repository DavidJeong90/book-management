'use client'

import { useState } from 'react'
import { Book, BookRequest } from '@/types/book'

interface Props {
  initialData?: Book
  onSubmit:     (data: BookRequest) => Promise<void>
  onCancel:     () => void
}

export default function BookForm({ initialData, onSubmit, onCancel }: Props) {
  const [title,   setTitle]         = useState(initialData?.title   ?? '')
  const [content, setContent]       = useState(initialData?.content ?? '')
  const [author,  setAuthor]        = useState(initialData?.author  ?? '')
  const [price,  setPrice]          = useState(initialData?.price  ?? 0)
  const [available,  setAvailable]  = useState(initialData?.available  ?? true)
  const [saving,  setSaving]        = useState(false)
  const [err,     setErr]           = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim())  { setErr('제목을 입력하세요.'); return }
    if (!author.trim()) { setErr('작성자를 입력하세요.'); return }
    setErr(null)
    setSaving(true)
    try {
      await onSubmit({ title: title.trim(), content: content.trim(), author: author.trim(), price: price, available: available })
    } catch (e) {
      setErr(e instanceof Error ? e.message : '저장 실패')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-blue-200 shadow-sm p-5"
    >
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        {initialData ? '✏️ 도서 수정' : '📝 새 도서 등록'}
      </h3>

      {err && (
        <p className="text-red-500 text-xs mb-3">❌ {err}</p>
      )}

      <div className="space-y-3">
        {/* 제목 */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            제목 <span className="text-red-400">*</span>
          </label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            maxLength={200}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
        </div>

        {/* 내용 */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">내용</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-300
                       resize-none transition"
          />
        </div>

        {/* 작성자 */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            작성자 <span className="text-red-400">*</span>
          </label>
          <input
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="이름을 입력하세요"
            maxLength={100}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            가격
          </label>
          <input
              type="number"
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              placeholder="가격을 입력하세요"
              maxLength={100}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            대출여부
          </label>
          <div className="flex items-center gap-4 py-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                  type="radio"
                  name="available"
                  value="true"
                  checked={available}
                  onChange={e => setAvailable(e.target.value === "true")}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-300"
              />
              <span>가능 (True)</span>
            </label>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                  type="radio"
                  name="available"
                  value="false"
                  checked={!available}
                  onChange={e => setAvailable(e.target.value === "true")}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-300"
              />
              <span>불가능 (False)</span>
            </label>
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex gap-2 mt-4 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100
                     rounded-lg transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg
                     hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? '저장 중...' : (initialData ? '수정 완료' : '저장')}
        </button>
      </div>
    </form>
  )
}
