import styled from 'styled-components';

export const ConnectionStatus = styled.div<{
  active?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 8px;

  color: ${props =>
    props.active ? props.theme.colors.highlightGreen : props.theme.colors.highlightRed};
  font-weight: 500;

  &:before {
    content: '';
    display: block;

    width: 12px;
    height: 12px;

    background-color: currentColor;
    border-radius: 50%;
  }
`;
