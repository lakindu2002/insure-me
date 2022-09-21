import { Vehicle } from '@insureme/vehicles/Vehicle.type';

export enum AccidentType {
  REAR = 'rear',
  HEAD_ON = 'head-on',
  SIDE_IMPACT = 'side-impact',
  ROLLOVER = 'rollover',
  LOW_SPEED = 'low-speed',
  HIT_AND_RUN = 'hit-and-run',
}

export type AccidentLocation = {
  latitude: number;
  longitude: number;
};

export enum ClaimStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export type Claim = {
  accidentType: AccidentType;
  id: string;
  location: AccidentLocation;
  pictures: string[];
  vehicle: Vehicle;
  createdAt: number;
  updatedAt: number;
  time: number;
  status: ClaimStatus;
  userId: string;
  user: {
    name: string;
    nic: string;
    email: string;
    phone: string;
  }
  expectedAmount: number;
  approvedAmount?: number;
};
