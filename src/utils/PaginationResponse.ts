import { Request } from "express";
import { HttpError } from "./httpError";
interface paginatedResponse {
  total?: number;
  page: number;
  limit: number;
  totalPages?: number;
  dir: string;
  sortBy: string;
  results?: [];
}

export class PaginationResponse {
  private paginationResponse: paginatedResponse;

  constructor(req: Request) {
    this.paginationResponse = {
      limit: parseInt((req.query.limit as string) || "10"),
      page: parseInt((req.query.page as string) || "1"),
      dir:
        (req.query.dir as string) === "ASC"
          ? "ASC"
          : (req.query.dir as string) === "DESC"
          ? "DESC"
          : "ASC",
      sortBy: (req.query.sortBy as string) || "updatedDate",
      results: [],
    };
  }

  public getResponse(): paginatedResponse {
    return this.paginationResponse;
  }

  public setResults(result: any) {
    this.paginationResponse.results = result;
  }

  private setTotalPages() {
    this.paginationResponse.totalPages = Math.ceil(
      this.paginationResponse.total
        ? this.paginationResponse.total / this.paginationResponse.limit
        : 0 / this.paginationResponse.limit
    );
  }

  public setTotal(total: number) {
    this.paginationResponse.total = total;
    this.setTotalPages();
  }

  public getOffset(): number {
    if (this.paginationResponse.page === 0) {
      throw new HttpError(
        HttpError.BAD_REQUEST_CODE,
        HttpError.BAD_REQUEST_DESCRIPTION,
        "page can't be 0"
      );
    }
    return (this.paginationResponse.page - 1) * this.paginationResponse.limit;
  }

  public getOrder(): any[] {
    return [[this.paginationResponse.sortBy, this.paginationResponse.dir]];
  }
}
