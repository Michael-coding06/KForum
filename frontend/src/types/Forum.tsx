// export interface Topic {
//   ID: number;
//   Title: string;
//   Description: string;
//   Label: 'created' | 'none';
// }

export interface Topic {
  ID: number;
  Title: string;
  Description: string;
  Pinned: boolean;
  Created: boolean;
}

export interface CreateTopicRequest {
  title: string;
  description: string;
}

export interface CreateTopicResponse {
  message: string;
  topic?: Topic;
}
