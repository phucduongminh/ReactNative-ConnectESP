import styled from 'styled-components/native';
import Feather from 'react-native-vector-icons/Feather';
import {theme} from 'styled-tools';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  height: 46px;
  margin: 0 ${theme('spacing.default')};
  padding: 0 ${theme('spacing.sm')};
  background: whitesmoke;
  border-radius: ${theme('radius.xs')};
`;

export const Icon = styled(Feather).attrs(({theme}) => ({
  size: 18,
  name: 'search',
  color: 'black',
}))``;

export const Field = styled.TextInput.attrs(({theme}) => ({
  placeholderTextColor: 'black',
}))`
  flex: 1;
  padding: 0;
  margin-left: ${theme('spacing.sm')};
  color: black;
`;
