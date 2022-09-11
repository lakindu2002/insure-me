import React, { FC } from 'react';
import { TextInput } from 'react-native-paper';
import { TextInputProps } from 'react-native-paper/lib/typescript/components/TextInput/TextInput';

interface OutlinedTextInputProps extends Partial<TextInputProps> { }

export const OutlinedTextInput: FC<OutlinedTextInputProps> = (props) => {
  return (
    <TextInput {...props}
      mode='outlined'
    />
  );
};
