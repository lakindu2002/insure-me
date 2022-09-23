import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import moment from 'moment';
import { FC, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { OutlinedTextInput } from './OutlinedTextInput';

interface TimePickerProps {
  initialValue?: number;
  onDateChange: (date: Date) => void;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }
})

export const TimePicker: FC<TimePickerProps> = ({ initialValue = Date.now(), onDateChange }) => {
  const theme = useTheme();
  const launchTimePicker = useCallback(() => {
    DateTimePickerAndroid.open({
      mode: 'time',
      value: new Date(initialValue),
      is24Hour: true,
      onChange: (_event, date) => {
        onDateChange(date as Date);
      },

    })
  }, []);

  return (
    <View
      style={styles.container}
    >
      <OutlinedTextInput
        label='Time'
        style={{
          flexGrow: 1,
          marginRight: 10,
          height: 50,
        }}
        editable={false}
        value={moment(initialValue).format('HH:mm')}
      />
      <Button
        mode='contained'
        onPress={launchTimePicker}
      >
        Select Time
      </Button>
    </View>
  );
};
