package com.example.bookmanagement.controller;

import com.example.bookmanagement.dto.BookRequestDto;
import com.example.bookmanagement.dto.BookResponseDto;
import com.example.bookmanagement.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    // GET /api/books — 전체 조회
    @GetMapping
    public ResponseEntity<List<BookResponseDto>> findAll() {
        return ResponseEntity.ok(bookService.findAll());
    }

    // GET /api/books/{id} — 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<BookResponseDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.findById(id));
    }

    // POST /api/books — 생성
    @PostMapping
    public ResponseEntity<BookResponseDto> create(@Valid @RequestBody BookRequestDto dto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(bookService.create(dto));
    }

    // PUT /api/books/{id} — 수정
    @PutMapping("/{id}")
    public ResponseEntity<BookResponseDto> update(
            @PathVariable Long id,
            @Valid @RequestBody BookRequestDto dto) {
        return ResponseEntity.ok(bookService.update(id, dto));
    }

    // DELETE /api/books/{id} — 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
