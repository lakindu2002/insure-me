import { OutlinedTextInput } from '@insureme/common/OutlinedTextInput';
import { FC, useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, RadioButton, Text } from 'react-native-paper';
import { ClaimStatus } from './Claim.type';
import { getClaimStatusName } from './Claim.util';
import { useClaims } from './ClaimsContext';

interface ClaimStatusUpdateModalProps {
  open: boolean;
  onClose: () => void;
}

const statusList = [
  { label: getClaimStatusName(ClaimStatus.PROCESSING), value: ClaimStatus.PROCESSING },
  { label: getClaimStatusName(ClaimStatus.APPROVED), value: ClaimStatus.APPROVED },
  { label: getClaimStatusName(ClaimStatus.REJECTED), value: ClaimStatus.REJECTED },
]

export const ClaimStatusUpdateModal: FC<ClaimStatusUpdateModalProps> = (props) => {
  const { onClose, open } = props;
  const { claim, updateClaim } = useClaims();

  const [selectedStatus, setSelectedStatus] = useState<ClaimStatus | undefined>(undefined);
  const [approvedCurrency, setApprovedCurrency] = useState<string | undefined>(undefined);
  const [approvedAmount, setApprovedAmount] = useState<number | undefined>(undefined);
  const [errors, setErrors] = useState<{ key: string, message: string }[]>([]);
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    if (claim?.status) {
      setSelectedStatus(claim.status);
    }
  }, [claim?.status]);

  useEffect(() => {
    if (claim?.approvedAmount) {
      setApprovedAmount(claim.approvedAmount);
    }
    if (claim?.approvedCurrency) {
      setApprovedCurrency(claim.approvedCurrency);
    }
  }, [claim?.approvedAmount]);

  useEffect(() => {
    if (claim?.approvedCurrency) {
      setApprovedCurrency(claim.approvedCurrency);
    }
  }, [claim?.approvedCurrency]);

  const handleStatusChange = useCallback((newStatus: string) => {
    setSelectedStatus(newStatus as ClaimStatus);
  }, []);

  const handleConfirmStatusChange = async () => {
    const formErrors: { key: string, message: string }[] = [];
    if (selectedStatus === ClaimStatus.APPROVED && (!approvedCurrency)) {
      formErrors.push({ key: 'approvedCurrency', message: 'Currency is required' });
    }
    if (selectedStatus === ClaimStatus.APPROVED && (!approvedAmount)) {
      formErrors.push({ key: 'approvedAmount', message: 'Amount is required' });
    }
    setErrors(formErrors);
    setUpdating(true);
    const updated = await updateClaim(claim?.id || '', {
      status: selectedStatus,
      ...selectedStatus === ClaimStatus.APPROVED && { approvedCurrency, approvedAmount: Number(approvedAmount) }
    });
    setUpdating(false);
    if (updated) {
      onClose();
      return;
    }
  }

  const handleAmountChanged = (newAmount: string) => {
    if (isNaN(Number(newAmount))) {
      return;
    }
    setApprovedAmount(Number(newAmount));
  }

  return (
    <Portal>
      <Dialog onDismiss={onClose} visible={open}>
        <Dialog.Title>Update Claim Status</Dialog.Title>
        <Dialog.Content>
          <RadioButton.Group
            value={(selectedStatus || '').toString()}
            onValueChange={handleStatusChange}
          >
            {statusList.map((status) => (
              <View
                key={status.value}
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
              >
                <RadioButton
                  value={status.value.toString()}
                  status={selectedStatus === status.value ? 'checked' : 'unchecked'}
                />
                <Text style={{
                  fontSize: 17
                }}>
                  {status.label}
                </Text>
              </View>
            ))}
          </RadioButton.Group>
          {selectedStatus === ClaimStatus.APPROVED && (
            <View
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 20 }}
            >
              <OutlinedTextInput
                label={'Currency'}
                style={{ flex: 1, marginRight: 20 }}
                value={approvedCurrency}
                onChangeText={setApprovedCurrency}
                helperText={errors.find((error) => error.key === 'approvedCurrency')?.message}
                error={!!errors.find((error) => error.key === 'approvedCurrency')}
              />
              <OutlinedTextInput
                label={'Approved Amount'}
                style={{ flex: 2 }}
                value={approvedAmount?.toFixed()}
                onChangeText={handleAmountChanged}
                helperText={errors.find((error) => error.key === 'approvedAmount')?.message}
                error={!!errors.find((error) => error.key === 'approvedAmount')}
              />
            </View>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            mode='outlined'
            style={{ marginRight: 10 }}
            onPress={onClose}>Dismiss</Button>
          <Button
            mode='contained'
            loading={updating}
            disabled={selectedStatus === claim?.status}
            onPress={handleConfirmStatusChange}>Change Status</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
