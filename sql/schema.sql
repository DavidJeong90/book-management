-- =====================================================
-- schema.sql — book_management 데이터베이스 초기화
-- 실행: mysql -h [RDS 엔드포인트] -u admin -p < schema.sql
-- =====================================================

CREATE DATABASE IF NOT EXISTS book_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE book_management;
CREATE TABLE IF NOT EXISTS books (
    id         BIGINT       AUTO_INCREMENT PRIMARY KEY,
    title      VARCHAR(200) NOT NULL,
    content    TEXT,
    author     VARCHAR(100) NOT NULL DEFAULT 'anonymous',
    price      INTEGER,
    available  BOOLEAN      DEFAULT TRUE,
    server_ip  VARCHAR(50)  COMMENT '응답 App 서버 IP (로드밸런싱 확인)',
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 초기 데이터
INSERT INTO books (title, content, author, server_ip, price, available) VALUES
  ('도서1',    '도서1 내용', '작성자1', 'Init', 1000, true),
  ('도서2',    '도서2 내용', '작성자2', 'Init', 2000, true),
  ('도서3',    '도서3 내용', '작성자3', 'Init', 3000, true),
  ('도서4',    '도서4 내용', '작성자4', 'Init', 4000, true);

SELECT id, title, author, price, available, created_at FROM books;
