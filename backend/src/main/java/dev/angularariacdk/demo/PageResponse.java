package dev.angularariacdk.demo;

import java.util.List;

public record PageResponse<T>(List<T> content, long totalElements, int totalPages, int number, int size) {
    public static <T> PageResponse<T> from(List<T> values, int requestedPage, int requestedSize) {
        int pageSize = Math.min(100, Math.max(1, requestedSize));
        int pageNumber = Math.max(0, requestedPage);
        int start = Math.min(pageNumber * pageSize, values.size());
        int end = Math.min(start + pageSize, values.size());
        int pages = (int) Math.ceil((double) values.size() / pageSize);

        return new PageResponse<>(values.subList(start, end), values.size(), pages, pageNumber, pageSize);
    }
}
