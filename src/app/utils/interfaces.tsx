export interface Photo {
  id: string;
  user_id: string;
  name: string;
  description: string;
  path: string;
  status: boolean;
  category?: Category; // Optional because it might be loaded separately
  user?: {
    username: string;
    email: string;
    id?: string;
    user_icon?: string;
  };
}

export interface Comment {
  id: string;
  content: string;
  id_photo: string;
  id_user: string;
  status: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  user_icon: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}
