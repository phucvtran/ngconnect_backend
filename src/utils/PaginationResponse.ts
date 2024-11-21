import { Request } from "express";
interface paginatedResponse{
    total?:number,
    page:number,
    limit:number,
    totalPages?:number,
    dir:string,
    sortBy:string,
    results?:[]
}

export class PaginationResponse{
    private paginationResponse:paginatedResponse;
  
    constructor(req: Request) {
        this.paginationResponse = {
            limit: parseInt(req.query.limit as string || "10"),
            page: parseInt(req.query.page as string || "10"),
            dir: req.query.dir as string === "ASC" ? "ASC": req.query.dir as string === "DESC" ? "DESC" : "ASC",
            sortBy:req.query.sortBy as string || "id",
            results:[]
        };
    }

    public getResponse(): paginatedResponse{
        return this.paginationResponse
    }

    public setResults(result:any){
        this.paginationResponse.results = result;
    }

    private setTotalPages(){
        this.paginationResponse.totalPages = Math.ceil(this.paginationResponse.total? this.paginationResponse.total:0 / this.paginationResponse.limit)
    }

    public setTotal(total:number){
        this.paginationResponse.total = total;
        this.setTotalPages();
    }

    public getOffset():number{
       return (this.paginationResponse.page - 1 ) * this.paginationResponse.limit;
    }

    public getOrder():any[]{
        console.log([this.paginationResponse.sortBy, this.paginationResponse.dir])
        return [[this.paginationResponse.sortBy, this.paginationResponse.dir]]
    }
}