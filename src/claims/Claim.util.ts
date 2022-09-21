import { AccidentType, ClaimStatus } from './Claim.type';

const accidentTypeNames = {
  [AccidentType.HEAD_ON]: 'Head On',
  [AccidentType.HIT_AND_RUN]: 'Hit and Run',
  [AccidentType.LOW_SPEED]: 'Low Speed',
  [AccidentType.REAR]: 'Rear',
  [AccidentType.ROLLOVER]: 'Rollover',
  [AccidentType.SIDE_IMPACT]: 'Side Impact',
};

const claimStatusNames = {
  [ClaimStatus.APPROVED]: 'Approved',
  [ClaimStatus.PENDING]: 'Pending',
  [ClaimStatus.PROCESSING]: 'Processing',
  [ClaimStatus.REJECTED]: 'Rejected',
}

export const getAccidentTypeName = (type: AccidentType, appendText: string = '') => `${accidentTypeNames[type]} ${appendText}`;
export const getClaimStatusName = (status: ClaimStatus) => claimStatusNames[status];
