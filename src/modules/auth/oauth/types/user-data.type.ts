export interface IUserData {
  id: string;
  email: string;
  password: string;
  displayName: string;
  username: string;
  age: number | null;
  avatar: string | null;
  male: "male" | "female" | null;
  phone: "string" | null;
  createdAt: Date;
  updatedAt: Date;
}
