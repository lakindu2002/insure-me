import React, { FC } from 'react';
import { View } from 'react-native';
import { Divider, IconButton, List, useTheme } from 'react-native-paper';

interface ReadOnlyFieldProps {
  label: string;
  content: string | JSX.Element;
  onPress?: () => void;
}

export const ReadOnlyField: FC<ReadOnlyFieldProps> = props => {
  const theme = useTheme();
  const { label, content, onPress } = props;
  return (
    <View>
      <List.Item
        title={label}
        descriptionEllipsizeMode='tail'
        onPress={onPress}
        style={{
          backgroundColor: theme.colors.surface,
        }}
        titleStyle={{
          color: theme.colors.disabled,
          fontSize: 16,
          fontWeight: '700',
        }}
        description={typeof content === 'string' ? content : descriptionProps => <View {...descriptionProps}
          style={{ marginTop: 20 }}
        >
          {content}
        </View>}
        descriptionStyle={{
          color: theme.colors.text,
          fontSize: 17,
          marginTop: 5,
        }}
        {...onPress && {
          right: () => (<IconButton
            style={{
              marginTop: 14
            }}
            icon={'chevron-right'} color={theme.colors.disabled} />
          )
        }}
      />
      <Divider style={{ marginTop: 0.5 }} />
    </View>
  );
};
