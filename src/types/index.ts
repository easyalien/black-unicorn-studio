export enum UserRole {
  MEMBER = 'MEMBER',
  SUPERUSER = 'SUPERUSER'
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  category?: string;
  completed: boolean;
  isPrivate: boolean;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  completedBy?: string;
  user?: {
    firstName?: string;
    lastName?: string;
    email: string;
  };
  completedByUser?: {
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}