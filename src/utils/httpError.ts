export class HttpError extends Error {
    public static NOT_FOUND_CODE = 404;
    public static NOT_FOUND_DESCRIPTION = "Not Found"
    public static UNAUTHORIZED_CODE = 401;
    public static UNAUTHORIZED_DESCRIPTION = "Unauthorized"
    public static FORBIDDEN_CODE = 403;
    public static FORBIDDEN_DESCRIPTION = "Forbidden"
    public static BAD_REQUEST_CODE = 400;
    public static BAD_REQUEST_DESCRIPTION = "Bad Requests";

    public static CREATE_SUCCESSFUL_CODE = 201;
    public static SUCESSFUL_CODE = 200;

    public statusCode: number;
    public description:string;
  
    constructor(statusCode: number = 500, description:string, message:string ) {
      super(message);
      this.description = description
      this.statusCode = statusCode;
    }
  }
  