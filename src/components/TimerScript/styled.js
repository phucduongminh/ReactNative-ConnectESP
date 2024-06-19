import styled from 'styled-components/native';
import {StyleSheet} from 'react-native';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  label: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  radioButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  radioButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  degreePickerContainer: {
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
    width: '100%',
  },
  pickerItem: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  timePickerButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#067b90',
    marginHorizontal: 60,
  },
  colon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    marginTop: 20,
    justifyContent: 'center',
  },
});
