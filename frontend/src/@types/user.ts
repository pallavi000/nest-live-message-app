export type TAvatarInputs = {
  avatar: File;
};

export interface LoginInputs {
  email: string;
  password: string;
}

export interface RegisterInputs extends LoginInputs {
  name: string;
}

export type TMember = {
  id: number;
  memberType: string;
  memberSince: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: TUser;
};

export type TUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
};
