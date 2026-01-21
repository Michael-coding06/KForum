export interface Post {
  ID: number;
  Title: string;
  Details: string;
  NoLikes: number;
  NoDislikes: number;
  NoComments: number;
  Edited: boolean;
  EditedAt: string | null;
  Liked: boolean;
  Disliked: boolean;
  CreatedBy: string;
}