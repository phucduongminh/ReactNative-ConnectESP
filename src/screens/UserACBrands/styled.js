import styled from 'styled-components/native';
import {theme} from 'styled-tools';
import {StyleSheet} from 'react-native';

export const Container = styled.View`
  flex: 1;
  padding-top: ${theme('spacing.default')};
  background: #ffff;
`;

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '18%',
    backgroundColor: '#f1f3f4',
    borderRadius: 20,
    padding: 20,
    height: 'auto',
  },
});
