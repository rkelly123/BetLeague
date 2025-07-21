export interface JwtPayload {
  sub: string;         // usually the user email or ID
  exp: number;         // expiration timestamp
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface League {
  id: number;
  name: string;
  description: string;
  owner: User;
  members: User[];
}