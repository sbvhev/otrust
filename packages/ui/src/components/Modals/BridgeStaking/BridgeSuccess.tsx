import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import * as Modal from '../styles';
import { Dimmer } from 'components';
import { Close, Success } from '../Icons';
import {
  MyBridgedNomBalanceDisplay,
  MyWrappedNomBalanceDisplay,
} from 'components/NomBalanceDisplay';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  padding: 40px;
`;

const Caption = styled.h3`
  margin-bottom: 20px;

  font-family: Barlow Condensed, sans-serif;
  font-size: 28px;
  font-weight: 500;
  color: ${props => props.theme.colors.txtPrimary};
`;

const Section = styled.section`
  margin-bottom: 20px;
`;

const Desc = styled.p`
  color: ${props => props.theme.colors.textSecondary};
`;

const ResultWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function BridgeSuccess({ amountValue = '0' }) {
  return (
    <>
      <Dimmer />
      <Modal.BridgeModalWrapper>
        <Link to="/">
          <Modal.CloseIcon>
            <Close />
          </Modal.CloseIcon>
        </Link>

        <Modal.BridgeLayout>
          <Wrapper>
            <Modal.ModalIconWrapper>
              <Success />
            </Modal.ModalIconWrapper>

            <Modal.Caption>Assets Bridged Successfully!</Modal.Caption>

            <Modal.ExchangeResult>
              <ResultWrapper>
                <div>
                  + {amountValue}
                  <sup>NOM</sup>
                </div>
                <Modal.DetailsSeparator>/</Modal.DetailsSeparator>
                <Modal.Spent>
                  - {amountValue}
                  <sup>wNOM</sup>
                </Modal.Spent>
              </ResultWrapper>
            </Modal.ExchangeResult>

            <Modal.ExchangeRateWrapper>
              <span>Exchange Rate</span>
              <strong>1 NOM = 1 wNOM</strong>
            </Modal.ExchangeRateWrapper>
            <Modal.ExchangeRateWrapper>
              <span>Transaction Fee</span>
              <strong>No</strong>
            </Modal.ExchangeRateWrapper>
            <Modal.ExchangeRateWrapper>
              <span>New NOM balance</span>
              <strong>
                <MyBridgedNomBalanceDisplay /> NOM
              </strong>
            </Modal.ExchangeRateWrapper>
            <Modal.ExchangeRateWrapper>
              <span>New wNOM balance</span>
              <strong>
                <MyWrappedNomBalanceDisplay /> wNOM
              </strong>
            </Modal.ExchangeRateWrapper>
          </Wrapper>
          <Modal.Info>
            <Caption>Congratulations & Welcome to the Onomy Network!</Caption>

            <Section>
              <Desc>
                Together, we will build the decentralized reserve bank and facilitate Forex volumes
                on-chain. Learn more by watching our animated film!
              </Desc>
            </Section>

            <Section>
              <div style={{ height: 338, backgroundColor: '#302e3d' }}>v i d e o</div>
            </Section>

            <Section>
              <Desc>
                Once NOM is in your wallet, you can start earning rewards by staking! You may manage
                staking at any point in the future, as well.
              </Desc>
            </Section>

            <Section>
              <Link to="/validators">
                <Modal.FullWidthButton>Start Staking</Modal.FullWidthButton>
              </Link>
            </Section>

            <Section>
              <Link to="/">
                <Modal.SecondaryButton style={{ width: '100%', height: 52 }}>
                  Done
                </Modal.SecondaryButton>
              </Link>
            </Section>
          </Modal.Info>
        </Modal.BridgeLayout>
      </Modal.BridgeModalWrapper>
    </>
  );
}