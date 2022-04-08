import React from 'react';
import styled from 'styled-components';
import { BigNumber } from 'bignumber.js';
import { useOnomyEth } from '@onomy/react-eth';

import logo from 'assets/logo.svg';
import { Container } from './UI';
import { responsive } from 'theme/constants';
import { EquivalentValue } from './EquivalentValue';
import { format18 } from 'utils/math';

const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 125px;
  width: 100%;

  @media screen and (max-width: ${responsive.laptop}) {
    height: 90px;
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    height: auto;
    padding: 20px;

    background-color: ${props => props.theme.colors.bgNormal};
  }
`;

const Logo = styled.div`
  display: flex;
  gap: 20px;
`;

const LogoImg = styled.img`
  @media screen and (max-width: ${responsive.laptop}) {
    height: 50px;
    width: 40px;
  }
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: none;
  }

  > strong {
    margin-bottom: 5px;

    color: ${props => props.theme.colors.textPrimary};
    font-family: 'Bebas Neue', sans-serif;
    font-size: 32px;
    font-weight: 600;
    line-height: 1;
    text-transform: uppercase;

    @media screen and (max-width: ${responsive.laptop}) {
      font-size: 20px;
    }
  }

  > span {
    color: ${props => props.theme.colors.textThirdly};
    line-height: 1;
  }
`;

const HeaderInfo = styled.div`
  display: flex;
`;

const HeaderInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media screen and (max-width: ${responsive.laptop}) {
    gap: 5px;
  }

  & + & {
    margin-left: 56px;

    @media screen and (max-width: ${responsive.laptop}) {
      margin-left: 32px;
    }
  }

  > strong {
    color: ${props => props.theme.colors.textThirdly};
    font-weight: 400;

    @media screen and (max-width: ${responsive.smartphoneLarge}) {
      font-size: 10px;
    }
  }
`;

const ExchangeRate = styled.div`
  display: flex;
  margin-right: 56px;

  @media screen and (max-width: ${responsive.laptop}) {
    margin-right: 32px;
  }
`;

const Issued = styled.div`
  padding-left: 56px;
  border-left: 1px solid ${props => props.theme.colors.bgHighlightBorder};

  @media screen and (max-width: ${responsive.laptop}) {
    padding-left: 32px;
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    padding: 0;

    border: none;
  }
`;

const HeaderInfoItemValue = styled.div`
  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: flex;
    flex-direction: column;

    gap: 5px;
  }

  > strong {
    margin-right: 12px;

    color: ${props => props.theme.colors.textPrimary};
    font-family: 'Bebas Neue', sans-serif;
    font-size: 24px;

    @media screen and (max-width: ${responsive.laptop}) {
      font-size: 20px;
    }

    @media screen and (max-width: ${responsive.smartphoneLarge}) {
      font-size: 18px;
    }
  }
`;

const Details = styled.span<{
  type?: 'increase' | 'decrease';
}>`
  color: ${props => {
    switch (props.type) {
      case 'increase':
        return props.theme?.colors.highlightGreen;
      case 'decrease':
        return props.theme?.colors.highlightRed;
      default:
        return props.theme?.colors.textPrimary;
    }
  }};
`;

export default function MainHeader() {
  const { supplyNOM, currentETHPrice } = useOnomyEth();

  return (
    <header>
      <Container>
        <HeaderWrapper>
          <Logo>
            <LogoImg src={logo} alt="Onomy" />
            <LogoText>
              <strong>Onomy</strong>
              <span>Bonding curve</span>
            </LogoText>
          </Logo>

          <div id="tour-prices">
            <HeaderInfo>
              <ExchangeRate>
                <HeaderInfoItem>
                  <strong>bNOM / USDT</strong>
                  <HeaderInfoItemValue>
                    <strong>
                      <EquivalentValue amount={1} asset="NOM" prefix="$" />
                    </strong>
                    {/*<Details type="increase">24.2%</Details>*/}
                  </HeaderInfoItemValue>
                </HeaderInfoItem>
                <HeaderInfoItem>
                  <strong>bNOM / ETH</strong>
                  <HeaderInfoItemValue>
                    <strong>
                      <span>
                        {BigNumber.isBigNumber(currentETHPrice)
                          ? `${(1.0 / format18(currentETHPrice).toNumber()).toFixed(8)}`
                          : 'Loading'}
                      </span>
                    </strong>
                  </HeaderInfoItemValue>
                </HeaderInfoItem>
              </ExchangeRate>
              <Issued>
                <HeaderInfoItem>
                  <strong>bNOM Issued</strong>
                  <HeaderInfoItemValue>
                    <strong>
                      <span>
                        {BigNumber.isBigNumber(supplyNOM)
                          ? `${Math.round(format18(supplyNOM).toNumber()).toLocaleString('en-US')}`
                          : 'Loading'}
                      </span>
                    </strong>
                    <Details>/ 100,000,000</Details>
                  </HeaderInfoItemValue>
                </HeaderInfoItem>
              </Issued>
            </HeaderInfo>
          </div>
        </HeaderWrapper>
      </Container>
    </header>
  );
}
