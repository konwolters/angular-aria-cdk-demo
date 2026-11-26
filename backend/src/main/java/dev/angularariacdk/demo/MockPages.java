package dev.angularariacdk.demo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

final class MockPages {
    private MockPages() {
    }

    static <T> Page<T> from(List<T> rows, Pageable requested) {
        // Mock-Listen ersetzen hier ein Repository, das die Seite direkt abfragen würde.
        var page = PageRequest.of(requested.getPageNumber(), Math.min(100, requested.getPageSize()));
        int start = (int) Math.min(page.getOffset(), rows.size());
        int end = start + Math.min(page.getPageSize(), rows.size() - start);
        return new PageImpl<>(rows.subList(start, end), page, rows.size());
    }
}
