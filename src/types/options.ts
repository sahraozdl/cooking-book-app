export interface Category {
  id: string;
  name?: string;
  strCategoryDescription?: string;
  strCategoryThumb?: string;
}

export interface Cuisine {
  id: string;
  name?: string;
  region?: string;
}

export interface Difficulty {
  id: string;
  avgTime?: string;
  name?: string;
}
export interface Serving {
  id: string;
  name?: string;
}
export interface Option {
  id: string;
  name: string;
}
