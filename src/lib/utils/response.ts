/**
 * Standardized API response helpers.
 *
 * Success: { success: true, data: T }
 * Error:   { success: false, error: { code: string, message: string } }
 */

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/** Standard error codes used across the application */
export const ErrorCode = {
  MEDICATION_NOT_FOUND: "MEDICATION_NOT_FOUND",
  COUNTRY_NOT_COVERED: "COUNTRY_NOT_COVERED",
  UNABLE_TO_VERIFY: "UNABLE_TO_VERIFY",
  RATE_LIMITED: "RATE_LIMITED",
  SUBSCRIPTION_REQUIRED: "SUBSCRIPTION_REQUIRED",
} as const;

export type ErrorCodeValue = (typeof ErrorCode)[keyof typeof ErrorCode];

export function success<T>(data: T): ApiSuccess<T> {
  return { success: true, data };
}

export function error(code: string, message: string): ApiError {
  return { success: false, error: { code, message } };
}
