export interface ResultType {
  code: number;
  data: Data;
}

export interface Data {
  input: string;
  hints: Hint[];
}

export interface Hint {
  command:     string;
  description: string;
}
export type Message = {
  role: 'user' | 'assistant';
  content: string;
}
export type MessagePostBody = {
  messages: Message[];
}