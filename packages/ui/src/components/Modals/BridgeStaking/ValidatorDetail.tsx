import React from 'react';
import styled from 'styled-components/macro';
import { Link, useParams } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import { ValidatorData } from '@onomy/react-client';

import ValidatorFooter from './ValidatorFooter';
import ValidatorNodeHeader from './ValidatorNodeHeader';
import * as Modal from '../styles';
import BackButton from './BackButton';
import StakingModal from './StakingModal';
import { format18 } from 'utils/math';
import { FormattedNumber } from 'components/FormattedNumber';
import { EquivalentValue } from 'components/EquivalentValue';
import { responsive } from 'theme/constants';

const DelegateWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DelegateItem = styled.div<{
  reward?: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 4px;

  width: 50%;

  & + & {
    padding-left: 55px;

    border-left: 1px solid ${props => props.theme.colors.bgHighlightBorder};
  }

  > span {
    font-size: 14px;
    font-weight: 500;
    color: #9595a6;
  }

  > strong {
    margin-top: 16px;

    font-family: Bebas Neue, sans-serif;
    font-size: 40px;
    font-weight: 600;
    color: ${props =>
      props.reward ? props.theme.colors.highlightBlue : props.theme.colors.textPrimary};

    > sup {
      margin-left: 6px;
      font-size: 18px;
    }
  }
`;

const Footer = styled.footer`
  display: flex;
  flex-wrap: wrap;
  gap: 24px 100px;

  padding: 32px 0;
  margin-top: 40px;

  border-top: 1px solid ${props => props.theme.colors.bgHighlightBorder};

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    flex-direction: column;
    flex-wrap: nowrap;
    gap: 16px;
  }
`;

const FooterInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: calc(50% - 50px);

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    width: auto;
  }

  > span {
    font-size: 14px;
    font-weight: 400;
    color: ${props => props.theme.colors.textThirdly};
  }

  > strong {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.colors.textPrimary};
  }
`;

export default function ValidatorDetail({ data }: { data: ValidatorData }) {
  const { id } = useParams();
  const { validator, votingPower, delegation, rewards = null, selfStake = 0 } = data;

  if (!validator) return null;
  return (
    <StakingModal>
      <Modal.StakingWrapper>
        <Link to="/validators/">
          <BackButton />
        </Link>
        <ValidatorNodeHeader
          name={validator.description?.moniker ?? ''}
          url={validator.description?.website}
        />

        <DelegateWrapper>
          <DelegateItem>
            <span>Delegated</span>
            <strong>
              <FormattedNumber value={format18(delegation).toNumber()} />
              <sup>NOM</sup>
            </strong>
            <span>
              <EquivalentValue asset="NOM" prefix="$" amount={format18(delegation).toNumber()} />
            </span>
          </DelegateItem>
          <DelegateItem reward>
            <span>Reward</span>
            <strong>
              <FormattedNumber value={format18(new BigNumber(rewards?.amount ?? '0')).toNumber()} />
              <sup>XRP</sup>
            </strong>
            <EquivalentValue
              asset="NOM"
              prefix="$"
              amount={format18(new BigNumber(rewards?.amount ?? '0')).toNumber()}
            />
          </DelegateItem>
        </DelegateWrapper>

        <Footer>
          <FooterInfo>
            <span>Total Bonded</span>
            <strong>
              <FormattedNumber value={format18(new BigNumber(validator.tokens)).toNumber()} /> XRP
            </strong>
          </FooterInfo>
          <FooterInfo>
            <span>Self Bonded Rate</span>
            <strong>
              {(100 * selfStake).toFixed(2)}
              <sup>%</sup>
            </strong>
          </FooterInfo>
          <FooterInfo>
            <span>Commission</span>
            <strong>
              <FormattedNumber
                value={
                  format18(
                    new BigNumber(validator.commission?.commissionRates?.rate ?? '0')
                  ).toNumber() * 100
                }
              />
              <sup>%</sup>
            </strong>
          </FooterInfo>
          <FooterInfo>
            <span>Voting Power</span>
            <strong>
              <FormattedNumber value={votingPower ?? 0} />%
            </strong>
          </FooterInfo>
        </Footer>
      </Modal.StakingWrapper>
      <ValidatorFooter>
        <Link to={`/validators/${id}/undelegate`}>
          <Modal.SecondaryButton type="button">Undelegate</Modal.SecondaryButton>
        </Link>
        <Link to={`/validators/${id}/delegate`}>
          <Modal.PrimaryButton type="button">Delegate</Modal.PrimaryButton>
        </Link>
      </ValidatorFooter>
    </StakingModal>
  );
}