import styled from 'styled-components/native';
import {theme} from 'styled-tools';

export const Container = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
})``;

export const Content = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 46px;
  margin: 0 ${theme('spacing.default')};
  padding: 0 ${theme('spacing.sm')};
  background-color: pink;
  border-radius: 10px;
  margin-top: 10px;
`;

export const Name = styled.Text`
  font-size: 14px;
  color: black;
`;
