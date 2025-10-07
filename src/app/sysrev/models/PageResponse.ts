export interface PageResponse<T> {
    data: T[];
    page:{
        totalElements: number;
        totalPages: number;
        pageNumber: number;
        size: number;
    }
}
