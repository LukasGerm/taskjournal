export interface TokenPayload {
  sub: number;
  username: string;
  email: string;
}

export interface AuthProfile {
  username: string;
  email: string;
  id: string;
}
