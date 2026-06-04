export type UserRole = 'Admin' | 'User';

export interface UserDto {
  id: number;
  nombre: string;
  email: string;
  role: string;
}

export interface UserRegisterDto {
  nombre: string;
  email: string;
  password: string;
  role?: string; // opcional, por defecto "User"
}

export interface UserUpdateDto {
  nombre?: string;
  email?: string;
  password?: string;
  role?: string;
}
export interface UserLoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserDto;
}
