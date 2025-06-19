export interface JwtPayload {
  sub: string;         // usually the user email or ID
  exp: number;         // expiration timestamp
}