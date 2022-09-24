import { Vehicle } from '@insureme/vehicles/Vehicle.type';

export enum AccidentType {
  REAR = 'rear',
  HEAD_ON = 'head-on',
  SIDE_IMPACT = 'side-impact',
  ROLLOVER = 'rollover',
  LOW_SPEED = 'low-speed',
  HIT_AND_RUN = 'hit-and-run',
}

export enum ClaimStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export type ClaimVehicle = {
  licensePlate: string;
  chassisNumber: string;
  model: string;
  brand: string;
  pictureUrl: string;
}

export type Claim = {
  accidentType: AccidentType;
  id: string;
  vehicle: ClaimVehicle;
  createdAt: number;
  updatedAt: number;
  time: number;
  status: ClaimStatus;
  ownerId: string;
  owner: {
    name: string;
    nic: string;
    phone: string;
  }
  managerId?: string;
  manager?: {
    name: string;
  }
  expectedCurrency: string;
  expectedAmount: number;
  approvedAmount?: number;
  location: string;
  pictures: string[];
};
