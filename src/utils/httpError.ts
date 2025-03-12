export class HttpError extends Error {
  public static NOT_FOUND_CODE = 404;
  public static NOT_FOUND_DESCRIPTION = "Not Found";
  public static UNAUTHORIZED_CODE = 401;
  public static UNAUTHORIZED_DESCRIPTION = "Unauthorized";
  public static FORBIDDEN_CODE = 403;
  public static FORBIDDEN_DESCRIPTION = "Forbidden";
  public static BAD_REQUEST_CODE = 400;
  public static BAD_REQUEST_DESCRIPTION = "Bad Requests";

  public static HTTP_MESSAGE = {
    ERROR_RESTRICTED_PERMISSION: "Restricted permission or session is expired.",
    ERROR_CREATE_JOB:
      "You are trying to create job. use createJob api instead.",
    ERROR_CREATE_LISTING:
      "You are trying to create listing. use createListing api instead.",
    ERROR_MODIFY_LISTING_CATEGORY_TO_JOB:
      "Can't change normal listing to Job Listing",
    ERROR_MODIFY_JOB_LISTING_CATEGORY_TO_NORMAL:
      "Can't Change Job Listing to Normal Listing",
    SUCCESS_CREATE_LISTING: "Create listing successfully",
    SUCCESS_CREATE_JOB: "Create Job successfully",
    SUCCESS_UPDATE_LISTING: "Update listing successfully",
    SUCCESS_UPDATE_JOB_LISTING: "Update Job listing successfully",
    ERROR_LISTING_DOESNOT_EXISTED: "Listing does not exist.",
    ERROR_JOB_LISTING_DOESNOT_EXISTED: "Job Listing does not exist.",
    ERROR_REQUEST_EXIST: "Request already exist for this listing",
    ERROR_CREATE_REQUEST_FOR_OWN_LISTING:
      "You can't create request for your own listing",
    SUCCESS_CREATE_LISTING_REQUEST: "create listing request successfully",
    ERROR_LOGOUT_REFRESH_TOKEN_MISSING: "Refresh token is required for logout.",
    ERROR_INVALID_TOKEN: "Token not found or already invalidated.",
    SUCCESS_CREATE_USER: "User registered successfully",
    ERROR_USER_NOT_FOUND: "User not found.",
    ERROR_INVALID_PASSWORD: "Invalid password",
    ERROR_JWT_SIGN_TOKEN: "Unable to sign JWT",
    SUCCESS_LOGIN: "Login Successful",
    ERROR_MISSING_REFRESH_TOKEN: "Refresh token is required",
    ERROR_INVALID_REFRESH_TOKEN: "Invalid or expired refresh token.",
    SUCCESS_REFRESH_ACCESS_TOKEN: "Access token refreshed successfully.",
    SUCCESS_LOGOUT: "Logged out successfully. Token invalidated.",
    ERROR_IMAGE_FORMAT: "Only images (jpeg, jpg, png) are allowed",
    ERROR_NO_IMAGE_UPLOAD: "No image files uploaded",
    SUCCESS_IMAGE_UPLOAD: "Images uploaded.",
  };

  public static CREATE_SUCCESSFUL_CODE = 201;
  public static SUCCESSFUL_CODE = 200;

  public statusCode: number;
  public description: string;

  constructor(statusCode: number = 500, description: string, message: string) {
    super(message);
    this.description = description;
    this.statusCode = statusCode;
  }
}
