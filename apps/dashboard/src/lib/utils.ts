import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export interface APIError {
  message: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as APIError)?.message;
    if (message) return message;
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return "An unknown error occurred";
}
