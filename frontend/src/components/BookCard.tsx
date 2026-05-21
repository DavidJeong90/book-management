'use client'

import { Book } from '@/types/book'

interface Props {
  book:     Book
  onEdit:   () => void
  onDelete: () => void
}

export default function BookCard({ book, onEdit, onDelete }: Props) {
  const formatDate = (s: string) =>
    new Date(s).toLocaleString('ko-KR', {
      dateStyle: 'short',
      timeStyle: 'short',
    })

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5
                    hover:shadow-md transition-shadow">
      {/* 제목 + 버튼 */}
      <div className="flex items-start justify-between mb-2 gap-3">
        <h2 className="text-base font-semibold text-gray-800 leading-snug">
          {book.title}
        </h2>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={onEdit}
            className="text-xs px-3 py-1 rounded-lg bg-blue-50 text-blue-600
                       hover:bg-blue-100 transition-colors"
          >
            수정
          </button>
          <button
            onClick={onDelete}
            className="text-xs px-3 py-1 rounded-lg bg-red-50 text-red-500
                       hover:bg-red-100 transition-colors"
          >
            삭제
          </button>
        </div>
      </div>

      {/* 내용 */}
      {book.content && (
        <p className="text-gray-600 text-sm leading-relaxed mb-3 whitespace-pre-line">
          {book.content}
        </p>
      )}
        가격
        <h2 className="text-base font-semibold text-gray-800 leading-snug">
            {book.price}
        </h2>


      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium
            ${book.available
              ? 'bg-green-50 text-green-600 border border-green-200'
              : 'bg-gray-100 text-gray-500 border border-gray-200'
            }`}>
            {book.available ? '대여 가능' : '대여 중'}
      </span>

      {/* 메타 정보 */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400
                      border-t border-gray-50 pt-3">
        <span>✍ {book.author}</span>
        {/* 로드밸런싱 확인용 — ALB가 다른 EC2로 라우팅하면 IP가 바뀜 */}
        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">
          🖥 {book.serverIp}
        </span>
        <span className="ml-auto">{formatDate(book.createdAt)}</span>
      </div>
    </div>
  )
}
