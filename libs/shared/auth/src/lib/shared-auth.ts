export interface Session {
  token: number;
}

export interface AuthenticatedUser {
  session: Session;
  userId: string;
}
