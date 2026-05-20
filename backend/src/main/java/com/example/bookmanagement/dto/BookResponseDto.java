package com.example.bookmanagement.dto;

import com.example.bookmanagement.entity.Book;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

// =====================================================
// 응답 DTO — 엔티티 직접 노출 방지
// =====================================================
@Getter
@Setter
public class BookResponseDto {

    private Long          id;
    private String        title;
    private String        content;
    private String        author;
    private Integer       price;
    private boolean       available;
    private String        serverIp;    // 응답 서버 IP (로드밸런싱 확인)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Entity → DTO 변환
    public static BookResponseDto from(Book book) {
        BookResponseDto dto = new BookResponseDto();
        dto.id          = book.getId();
        dto.title       = book.getTitle();
        dto.content     = book.getContent();
        dto.author      = book.getAuthor();
        dto.price       = book.getPrice();
        dto.available   = book.getAvailable();
        dto.serverIp    = book.getServerIp();
        dto.createdAt   = book.getCreatedAt();
        dto.updatedAt   = book.getUpdatedAt();
        return dto;
    }
}
