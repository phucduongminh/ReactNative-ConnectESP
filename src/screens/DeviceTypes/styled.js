import styled from 'styled-components/native';
import {theme} from 'styled-tools';
import {StyleSheet} from 'react-native';

import db from '../../../db';

export const Container = styled.View`
  flex: 1;
  //background: ${theme('colors.background')};
  background: #ffff;
`;

export const Header = styled.View`
  justify-content: flex-end;
  margin: 50px auto 0 auto;
  padding-bottom: 50px;
`;

export const H1 = styled.Text`
  align-items: center;
  font-size: 35px;
  color: black;
`;

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    paddingTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  modalText: {
    paddingTop: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  button: {
    backgroundColor: db.theme.colors.primary,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 0,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
