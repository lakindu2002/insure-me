export type User = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
};

export enum UserRole {
  CUSTOMER = 'customer',
  CLAIM_ADJUSTER = 'claim_adjuster',
}
