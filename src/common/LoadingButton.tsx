import { Button, ButtonProps, Spinner, Text } from '@ui-kitten/components';
import { FC } from 'react';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  label: string;
}

export const LoadingButton: FC<LoadingButtonProps> = props => {
  const { loading, label, ...rest } = props;
  return (
    <>
      <Button {...rest}
        disabled={loading}
        accessoryRight={loading ? () => <Spinner status='basic' /> : undefined}
      >
        <Text
          category='c2'
        >
          {label.toUpperCase()}
        </Text>
      </Button>
    </>
  );
};

LoadingButton.defaultProps = {
  loading: false
}
