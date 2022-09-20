export type User = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  contact?: string;
  address?: string
  profilePictureUrl?: string;
  nicImageUrl?: string;
  preferredMode: 'dark' | 'light';
};

export enum UserRole {
  CUSTOMER = 'customer',
  CLAIM_ADJUSTER = 'claim_adjuster',
}
