export interface PaginationProp {
    totalPages: number;
    currentPage: number;
    onPageChange?: (page: number) => void;
}