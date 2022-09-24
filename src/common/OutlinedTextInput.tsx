import React, { FC, Fragment } from 'react';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import { TextInputProps } from 'react-native-paper/lib/typescript/components/TextInput/TextInput';

interface OutlinedTextInputProps extends Partial<TextInputProps> {
  helperText?: string | false | undefined;
}

export const OutlinedTextInput: FC<OutlinedTextInputProps> = ({ helperText, style, ...props }) => {
  return (
    <View
      {...style && {
        style: { ...style as any }
      }}
    >
      <TextInput {...props}
        mode='outlined'
      />{
        !!helperText && (
          <HelperText type={props.error ? 'error' : 'info'} visible={!!helperText}>
            {helperText}
          </HelperText>
        )
      }

    </View>
  );
};
