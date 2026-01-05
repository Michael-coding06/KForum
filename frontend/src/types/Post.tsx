export interface Post {
  ID: number;
  // Topic: string;
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