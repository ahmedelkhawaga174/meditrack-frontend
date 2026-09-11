export interface NoteRequest {
  content: string;
}

export interface NoteResponse {
  id: number;
  consultationId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
