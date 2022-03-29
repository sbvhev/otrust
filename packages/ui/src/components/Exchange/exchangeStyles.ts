import styled from 'styled-components';

import { responsive } from 'theme/constants';

export const ExchangeWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  height: 100%;
  padding: 24px 0;

  font-size: 14px;

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    grid-template-columns: 1fr;

    background-color: ${props => props.theme.colors.bgDarken};

    padding: 24px 20px;
  }
`;

export const ExchangeItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  width: 100%;
  height: 100%;
  padding: 0 40px;

  @media screen and (max-width: ${responsive.laptop}) {
    padding: 0 24px;
  }

  @media screen and (max-width: ${responsive.laptopSmall}) {
    padding: 0 10px;
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: none;
  }

  > strong {
    margin-bottom: 12px;

    font-size: 16px;

    @media screen and (max-width: ${responsive.laptop}) {
      font-size: 14px;
    }
  }

  & + & {
    border-left: 2px solid ${props => props.theme.colors.bgHighlightBorder};
  }
`;

export const Sending = styled.div<{
  error?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 70px;
  padding: 16px 8px 16px 16px;

  background-color: ${props => props.theme.colors.bgHighlightBorder};
  border-radius: 8px;
  border-bottom: 2px solid ${props => props.theme.colors.bgDarken};

  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
  font-weight: 500;

  @media screen and (max-width: ${responsive.laptop}) {
    height: 60px;
    padding: 16px 8px;
  }

  @media screen and (max-width: ${responsive.laptopSmall}) {
    height: 55px;
    padding: 10px 5px 10px 8px;

    font-size: 12px;
  }

  strong {
    color: ${props => props.theme.colors.textSecondary};
    margin-right: auto;
    font-weight: 500;
    white-space: nowrap;

    @media screen and (max-width: ${responsive.tabletSmall}) {
      font-size: 12px;
    }
  }
`;

export const BridgeSending = styled(Sending)`
  background: transparent;
  border: 1px solid
    ${props =>
      props.error ? props.theme.colors.highlightRed : props.theme.colors.bgHighlightBorder};
`;

export const SendingBox = styled.div`
  display: flex;
  align-items: center;

  gap: 16px;
`;

export const Receiving = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  width: 100%;
  margin-bottom: 12px;

  strong {
    color: ${props => props.theme.colors.textThirdly};
    margin-right: auto;
    font-weight: 500;

    @media screen and (max-width: ${responsive.laptopSmall}) {
      font-size: 14px;
    }

    @media screen and (max-width: ${responsive.tabletSmall}) {
      font-size: 12px;
    }
  }
`;

export const MaxBtn = styled.button`
  padding: 15px 20px;
  height: 54px;

  border: none;
  background-color: ${props => props.theme.colors.bgNormal};
  border-radius: 7px;

  color: ${props => props.theme.colors.highlightYellow};
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
  cursor: pointer;

  @media screen and (max-width: ${responsive.laptop}) {
    height: 44px;
  }

  &:hover {
    background-color: ${props => props.theme.colors.bgNormal_lighten};
  }

  &:active {
    background-color: ${props => props.theme.colors.bgNormal_darken};
  }
`;

export const BridgeMaxBtn = styled(MaxBtn)`
  background-color: transparent;
`;

export const ExchangeInput = styled.input`
  width: 100%;

  background: none;
  border: none;

  color: ${props => props.theme.colors.textPrimary};
  font-weight: 500;
  font-size: 18px;
  text-align: right;

  @media screen and (max-width: ${responsive.laptopSmall}) {
    font-size: 14px;
  }

  @media screen and (max-width: ${responsive.tabletSmall}) {
    font-size: 12px;
  }

  &:focus {
    outline: none;
  }
`;

export const ReceivingValue = styled.span`
  margin-left: auto;

  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};

  @media screen and (max-width: ${responsive.tabletSmall}) {
    font-size: 12px;
  }
`;

export const BridgeAddressInput = styled(ExchangeInput)`
  width: 100%;
  text-align: left;
  font-size: 14px;
`;

export const BridgeAmountInput = styled(ExchangeInput)`
  width: 100%;
  padding: 0 10px;
`;

export const ExchangeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 50px;
  width: 100%;

  background: linear-gradient(90deg, #5ac790, #1c7e4c);
  border: none;
  border-radius: 6px;

  color: ${props => props.theme.colors.textPrimary};
  text-shadow: 0 6px 3px rgba(0, 0, 0, 0.03);
  font-weight: 600;

  cursor: pointer;
`;

export const SellBtn = styled(ExchangeButton)`
  background: linear-gradient(90deg, #c75a5a, #7e1c1c);
`;

export const ModalTrigger = styled.div`
  display: none;

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
`;

export const ExchangeModalWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;

  background-color: ${props => props.theme.colors.bgNormal};
`;
