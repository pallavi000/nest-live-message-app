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

export type TUser = {
  id: number;
  socketId: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
};
