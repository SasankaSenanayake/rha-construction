export interface ApiSuccessResponse {
  success: true;
  submissionId: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: "VALIDATION_ERROR" | "SPAM_REJECTED" | "INTERNAL_ERROR";
    message: string;
    fieldErrors?: Record<string, string[]>;
  };
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;
