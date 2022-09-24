import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import moment from 'moment';
import { FC, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { OutlinedTextInput } from './OutlinedTextInput';

interface TimePickerProps {
  initialValue?: number;
  onDateChange: (date: Date) => void;
  mode: 'time' | 'date'
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }
})

export const TimePicker: FC<TimePickerProps> = ({ initialValue = Date.now(), onDateChange, mode }) => {
  const launchTimePicker = useCallback(() => {
    DateTimePickerAndroid.open({
      mode,
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
        value={moment(initialValue).format(mode === 'time' ? 'HH:mm' : 'Do MMMM YYYY')}
      />
      <Button
        mode='contained'
        onPress={launchTimePicker}
      >
        Select {mode === 'date' ? 'Date' : 'Time'}
      </Button>
    </View>
  );
};
