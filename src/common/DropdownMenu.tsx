import { FC, useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Dialog, Modal, Portal, Provider, RadioButton, Text, TextInput, useTheme } from 'react-native-paper';
import { OutlinedTextInput } from './OutlinedTextInput';

interface DropdownMenuProps {
  items: { label: string, value: string }[];
  onSelect: (value: string) => void;
  selected: { label: string, value: string } | undefined;
  label: string;
  disabled?: boolean;
  helperText?: string;
  error?: boolean;
}

export const DropdownMenu: FC<DropdownMenuProps> = ({ items, onSelect, selected, label, disabled = false, error, helperText }) => {
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string>('');

  useEffect(() => {
    if (!selected?.value) {
      return;
    }
    setSelectedValue(selected.value);
  }, [selected?.value]);

  const handleSelect = useCallback((newValue: string) => {
    onSelect(newValue);
    setDropdownVisible(false);
  }, []);
  return (
    <>
      <OutlinedTextInput
        value={selected?.label}
        editable={false}
        label={label}
        error={error}
        helperText={helperText}
        onPressIn={() => setDropdownVisible(true)}
        right={
          <TextInput.Icon icon='chevron-down'
            {...!disabled && {
              onPress: () => setDropdownVisible((prevState) => !prevState),
            }}
          />
        }
      />
      <Portal>
        <Dialog
          onDismiss={() => setDropdownVisible(false)}
          visible={dropdownVisible}>
          <Dialog.Title>
            Select an option
          </Dialog.Title>
          <Dialog.Content>
            {
              items.map((item) => (
                <View
                  key={item.value}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <RadioButton
                    value={''}
                    status={item.value === selectedValue ? 'checked' : 'unchecked'}
                    onPress={() => handleSelect(item.value)}
                  />
                  <Text
                    style={{
                      fontSize: 16
                    }}
                  >
                    {item.label}
                  </Text>
                </View>
              ))
            }
          </Dialog.Content>
        </Dialog>
      </Portal>
    </>
  );
};
