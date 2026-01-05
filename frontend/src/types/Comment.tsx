export interface Comment {
  ID: number,
  Comment: string;
  CreatedBy: string;
  
  CreatedAt: string | null;
  Edited: boolean;
  EditedAt: string | null;

  Liked: boolean;
  Disliked: boolean;
  NoLikes: number;
  NoDislikes: number;
  NoComments: number;
  ParentComment: number | null;
}

export interface ReplyReturn {
  id:number,
  comment: string, 
  created_by: string
}