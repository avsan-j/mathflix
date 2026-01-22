export type UserRole = 'researcher' | 'child' | 'parent';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name: string;
  parentId?: string;
  childId?: string;
  password?:string;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  email: string;
  name: string;
  role: UserRole;
}
