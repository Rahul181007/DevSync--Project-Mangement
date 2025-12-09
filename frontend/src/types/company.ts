export interface Company {
  _id: string;
  name: string;
  domain: string;
  slug?: string;
  status: "PENDING" | "APPROVED" | "SUSPENDED";
  ownerAdminId?: string;
  approvedBy?: string;
  createdAt?: string;
  updatedAt?: string;

  // For UI values (can be undefined)
  userCount?: number;
  plan?: string;
}
