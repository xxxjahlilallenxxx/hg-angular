export interface Server {
  name: string;
  ipAddress: string;
  memberCount: number;
  capacity: number;
  active: boolean;
  owner: string;
  // One-to-one with the server; the backend only populates this for the
  // requesting user's own servers, null otherwise.
  cfxRegistrationKey: string | null;
}

export interface CreateServerPayload {
  name: string;
  ipAddress: string;
  capacity: number;
  owner: string;
  cfxRegistrationKey: string;
}
