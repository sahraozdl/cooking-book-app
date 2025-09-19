export interface SearchUser {
  id: string;
  name?: string;
  email?: string;
  photoURL?: string;
}

export interface UserTypes {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  photoURL?: string;
  createdAt?: Date;
  writes?: string[];
  following?: string[];
  followers?: string[];
  writesCount?: number;
  savedRecipes?: string[];
  likedRecipes?: string[];
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
}
