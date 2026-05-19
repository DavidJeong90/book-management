package com.example.bookmanagement.repository;

import com.example.bookmanagement.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    // 작성자별 조회 (최신순)
    List<Book> findByAuthorOrderByCreatedAtDesc(String author);

    // 제목 키워드 검색 (대소문자 무관)
    List<Book> findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(String keyword);
}
