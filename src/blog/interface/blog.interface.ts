type Comment = {
  id: number;
  text: string;
  author: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  likes: number[];
};

export interface Blog {
  id: number;
  title: string;
  description: string;
  author: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  likes: number[];
  comments: Comment[];
}
