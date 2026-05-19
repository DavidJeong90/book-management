package com.example.bookmanagement;

import com.example.bookmanagement.dto.BookRequestDto;
import com.example.bookmanagement.dto.BookResponseDto;
import com.example.bookmanagement.repository.BookRepository;
import com.example.bookmanagement.service.BookService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")      // application-test.yml (H2)
@Transactional               // 각 테스트 후 롤백
class BookServiceTest {

    @Autowired
    private BookService bookService;

    @Autowired
    private BookRepository bookRepository;

    @BeforeEach
    void setUp() {
        bookRepository.deleteAll();

        BookRequestDto dto1 = new BookRequestDto();
        dto1.setTitle("도서1");
        dto1.setContent("도서1 내용");
        dto1.setAuthor("작성자1");
        bookService.create(dto1);

        BookRequestDto dto2 = new BookRequestDto();
        dto1.setTitle("도서2");
        dto1.setContent("도서2 내용");
        dto1.setAuthor("작성자2");
        bookService.create(dto2);
    }

    @Test
    @DisplayName("전체 조회 — 2건 반환")
    void findAll_returns2Books() {
        List<BookResponseDto> result = bookService.findAll();
        assertThat(result).hasSize(2);
        assertThat(result)
                .extracting("title")
                .containsExactlyInAnyOrder("도서1", "도서2");
    }

    @Test
    @DisplayName("단건 조회 — 제목 일치")
    void findById_returnsCorrectBook() {
        Long id = bookService.findAll().get(0).getId();
        BookResponseDto result = bookService.findById(id);
        assertThat(result.getId()).isEqualTo(id);
        assertThat(result.getTitle()).isNotBlank();
    }

    @Test
    @DisplayName("생성 — serverIp 자동 주입")
    void create_injectsServerIp() {
        BookRequestDto dto = new BookRequestDto();
        dto.setTitle("도서3");
        dto.setContent("도서3 내용");
        dto.setAuthor("작성자3");

        BookResponseDto result = bookService.create(dto);

        assertThat(result.getId()).isNotNull();
        assertThat(result.getTitle()).isEqualTo("도서3");
        assertThat(result.getServerIp()).isNotBlank();
    }

    @Test
    @DisplayName("수정 — 제목·내용 변경 확인")
    void update_changesFields() {
        Long id = bookService.findAll().get(0).getId();

        BookRequestDto dto = new BookRequestDto();
        dto.setTitle("수정된 제목");
        dto.setContent("수정된 내용");
        dto.setAuthor("editor");

        BookResponseDto result = bookService.update(id, dto);
        assertThat(result.getTitle()).isEqualTo("수정된 제목");
        assertThat(result.getContent()).isEqualTo("수정된 내용");
    }

    @Test
    @DisplayName("삭제 후 조회 — 404 예외")
    void delete_thenFindById_throws404() {
        Long id = bookService.findAll().get(0).getId();
        bookService.delete(id);

        assertThatThrownBy(() -> bookService.findById(id))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("찾을 수 없습니다");
    }

    @Test
    @DisplayName("없는 ID 조회 — 예외 발생")
    void findById_invalidId_throws() {
        assertThatThrownBy(() -> bookService.findById(99999L))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
