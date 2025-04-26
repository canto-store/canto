export interface LoginRequest extends Record<string, unknown> {
  email: string;
  password: string;
}

export interface RegisterRequest extends Record<string, unknown> {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
}
