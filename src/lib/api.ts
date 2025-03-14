// Base API URL from environment variable or fallback
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.canto-store.com";

// HTTP Methods enum
export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

// Default headers for JSON API requests
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Custom API error class for better error handling
export class ApiError extends Error {
  status: number;
  errors?: Record<string, string | string[]>;

  constructor(
    status: number,
    message: string,
    errors?: Record<string, string | string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;

    // Ensures proper instanceof checks work in ES5
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  // Helper to determine if error is client-side (4xx)
  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  // Helper to determine if error is server-side (5xx)
  isServerError(): boolean {
    return this.status >= 500;
  }
}

// Define possible response types from API
type ApiResponseData =
  | Record<string, unknown>
  | string
  | Blob
  | ArrayBuffer
  | null;

/**
 * Parses API response based on content type
 * @param response Fetch Response object
 * @returns Parsed response data
 */
async function parseResponse(response: Response): Promise<ApiResponseData> {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json().catch(() => ({}));
  }

  if (contentType?.includes("text/")) {
    return response.text();
  }

  // For binary responses, return as blob
  if (
    contentType?.includes("application/octet-stream") ||
    contentType?.includes("image/") ||
    contentType?.includes("audio/") ||
    contentType?.includes("video/")
  ) {
    return response.blob();
  }

  // For other types, return as arrayBuffer
  return response.arrayBuffer();
}

/**
 * Core fetch function with enhanced error handling and default JSON headers
 * @param endpoint The API endpoint (without the base URL)
 * @param options Request options
 * @returns The parsed response
 * @throws ApiError if the request fails
 */
export async function fetchData<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  try {
    // Ensure endpoint starts with a slash
    const normalizedEndpoint = endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;

    // Construct the full URL
    const url = `${API_BASE_URL}${normalizedEndpoint}`;

    // Merge default headers with any provided headers
    const mergedOptions: RequestInit = {
      ...options,
      headers: {
        ...DEFAULT_HEADERS,
        ...(options?.headers || {}),
      },
    };

    const response = await fetch(url, mergedOptions);
    const data = await parseResponse(response);

    if (!response.ok) {
      // Extract error details if available
      const errorMessage =
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string"
          ? data.message
          : `API error: ${response.status}`;

      const errorDetails =
        typeof data === "object" &&
        data !== null &&
        "errors" in data &&
        data.errors !== null
          ? (data.errors as Record<string, string | string[]>)
          : undefined;

      throw new ApiError(response.status, errorMessage, errorDetails);
    }

    return data as T;
  } catch (error) {
    // If it's already an ApiError, just rethrow it
    if (error instanceof ApiError) {
      throw error;
    }

    // For network errors or other unexpected errors
    if (error instanceof Error) {
      throw new ApiError(
        0, // Use 0 to indicate network/unknown error
        error.message || "Network error occurred",
        undefined,
      );
    }

    // For any other type of error
    throw new ApiError(0, "Unknown error occurred", undefined);
  }
}

/**
 * Performs a GET request to the API
 * @param endpoint The API endpoint (without the base URL)
 * @param options Additional request options (optional)
 * @returns The parsed response
 */
export async function getData<T>(
  endpoint: string,
  options?: Omit<RequestInit, "method">,
): Promise<T> {
  return fetchData<T>(endpoint, {
    method: HttpMethod.GET,
    ...options,
  });
}

/**
 * Performs a POST request to the API with JSON body
 * @param endpoint The API endpoint (without the base URL)
 * @param data The data to send in the request body
 * @param options Additional request options (optional)
 * @returns The parsed response
 */
export async function postData<T, D extends Record<string, unknown>>(
  endpoint: string,
  data: D,
  options?: Omit<RequestInit, "method" | "body">,
): Promise<T> {
  return fetchData<T>(endpoint, {
    method: HttpMethod.POST,
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * Performs a PUT request to the API with JSON body
 * @param endpoint The API endpoint (without the base URL)
 * @param data The data to send in the request body
 * @param options Additional request options (optional)
 * @returns The parsed response
 */
export async function putData<T, D extends Record<string, unknown>>(
  endpoint: string,
  data: D,
  options?: Omit<RequestInit, "method" | "body">,
): Promise<T> {
  return fetchData<T>(endpoint, {
    method: HttpMethod.PUT,
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * Performs a PATCH request to the API with JSON body
 * @param endpoint The API endpoint (without the base URL)
 * @param data The data to send in the request body
 * @param options Additional request options (optional)
 * @returns The parsed response
 */
export async function patchData<T, D extends Record<string, unknown>>(
  endpoint: string,
  data: D,
  options?: Omit<RequestInit, "method" | "body">,
): Promise<T> {
  return fetchData<T>(endpoint, {
    method: HttpMethod.PATCH,
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * Performs a DELETE request to the API
 * @param endpoint The API endpoint (without the base URL)
 * @param options Additional request options (optional)
 * @returns The parsed response
 */
export async function deleteData<T>(
  endpoint: string,
  options?: Omit<RequestInit, "method">,
): Promise<T> {
  return fetchData<T>(endpoint, {
    method: HttpMethod.DELETE,
    ...options,
  });
}
