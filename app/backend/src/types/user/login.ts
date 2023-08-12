export type Token = { token: string };

export type Roles = 'admin' | 'user';

export type UserRole = { role: Roles };

export type Authorization = { authorization: string };

export type UserCreateToken = { email: string, password: string };

export type UserRegister = {
  role: Roles;
  email: string;
  username: string;
  password: string;
};
