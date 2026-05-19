package com.example.bookmanagement.service;

import com.example.bookmanagement.dto.BookRequestDto;
import com.example.bookmanagement.dto.BookResponseDto;
import com.example.bookmanagement.entity.Book;
import com.example.bookmanagement.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.InetAddress;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    /**
     * 현재 서버 IP 조회
     * ALB가 여러 EC2에 트래픽을 분산할 때 어느 서버가 처리했는지 확인용
     */
    private String getServerIp() {
        try {
            return InetAddress.getLocalHost().getHostAddress();
        } catch (Exception e) {
            return "unknown";
        }
    }

    // 전체 조회
    @Transactional(readOnly = true)
    public List<BookResponseDto> findAll() {
        return bookRepository.findAll()
                .stream()
                .map(BookResponseDto::from)
                .collect(Collectors.toList());
    }

    // 단건 조회
    @Transactional(readOnly = true)
    public BookResponseDto findById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("도서를 찾을 수 없습니다. id=" + id));
        return BookResponseDto.from(book);
    }

    // 생성
    @Transactional
    public BookResponseDto create(BookRequestDto dto) {
        Book book = new Book(
                dto.getTitle(),
                dto.getContent(),
                dto.getAuthor(),
                dto.getPrice(),
                dto.getAvailable(),
                getServerIp()  // 생성 서버 IP 자동 주입
        );
        return BookResponseDto.from(bookRepository.save(book));
    }

    // 수정
    @Transactional
    public BookResponseDto update(Long id, BookRequestDto dto) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("도서를 찾을 수 없습니다. id=" + id));
        book.setTitle(dto.getTitle());
        book.setContent(dto.getContent());
        book.setAuthor(dto.getAuthor());
        book.setPrice(dto.getPrice());
        book.setAvailabe(dto.getAvailable());
        book.setServerIp(getServerIp());  // 수정 서버 IP 갱신
        // @Transactional + dirty checking → 자동 UPDATE
        return BookResponseDto.from(book);
    }

    // 삭제
    @Transactional
    public void delete(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new IllegalArgumentException("도서를 찾을 수 없습니다. id=" + id);
        }
        bookRepository.deleteById(id);
    }
}
