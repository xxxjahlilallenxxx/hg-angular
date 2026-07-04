export interface Server {
  name: string;
  ipAddress: string;
  memberCount: number;
  capacity: number;
  active: boolean;
  owner: string;
  // One-to-one with the server; only ever populated/shown for the owner.
  cfxRegistrationKey: string;
}
