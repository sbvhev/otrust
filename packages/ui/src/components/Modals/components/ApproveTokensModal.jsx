import React, { useState } from 'react';
import styled from 'styled-components';
import useInterval from '@use-it/interval';
import { BigNumber } from 'bignumber.js';
import { useOnomyEth } from '@onomy/react-eth';

import { Close } from '../Icons';
import * as Modal from '../styles';
import { responsive } from 'theme/constants';
import { useModal } from 'context/modal/ModalContext';
import { MaxBtn } from 'components/Exchange/exchangeStyles';
import { useExchange, useUpdateExchange } from 'context/exchange/ExchangeContext';
import { format18, parse18 } from 'utils/math';
import RequestFailedModal from './RequestFailedModal';

const Message = styled.div`
  margin: 32px 0 0;

  color: ${props => props.theme.colors.textSecondary};

  @media screen and (max-width: ${responsive.smartphone}) {
    font-size: 14px;
  }
`;

const Caption = styled(Modal.Caption)`
  text-align: left;
`;

const ApproveTokensWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 12px;
  margin-top: 24px;

  background-color: ${props => props.theme.colors.bgHighlightBorder};
  border-radius: 8px;

  > div {
    margin-left: 8px;

    display: flex;
    flex-direction: column;
  }

  label {
    margin-bottom: 6px;

    color: ${props => props.theme.colors.textThirdly};
    font-size: 12px;
  }

  input {
    display: block;

    background: none;
    border: none;

    color: ${props => props.theme.colors.textPrimary};
    font-size: 18px;

    &:focus {
      outline: none;
    }
  }
`;

export default function ApproveTokensModal({ onConfirmApprove }) {
  const [count, setCount] = useState(60);
  const [delay, setDelay] = useState(1000);
  const { handleModal } = useModal();
  const { approve, bidAmount, input } = useExchange();
  const { objDispatch, strDispatch } = useUpdateExchange();
  const { NOMallowance, weakBalance } = useOnomyEth();

  const initialApproveAmount = bidAmount.minus(NOMallowance);

  const increaseCount = () => {
    if (count === 0) {
      setDelay(null);
      handleModal();
    } else {
      setCount(count - 1);
    }
  };

  useInterval(increaseCount, delay);

  const onTextChange = async event => {
    event.preventDefault();

    // console.log('Approve Amount:-approve ', approve);

    const floatRegExp = new RegExp(/(^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$)|(^\d\.$)/);

    if (floatRegExp.test(event.target.value.toString())) {
      // console.log('Approve Amount:-pass ', approve);

      const approvalAmount = parse18(new BigNumber(parseFloat(event.target.value).toString()));

      let objUpdate = new Map();
      objUpdate = objUpdate.set('approveAmount', approvalAmount);

      objDispatch({
        type: 'update',
        value: objUpdate,
      });

      let strUpdate = new Map();
      strUpdate = strUpdate.set('approve', format18(approvalAmount).toFixed());

      strDispatch({
        type: 'update',
        value: strUpdate,
      });
    } else {
      // console.log('Text Change: ', 'regex failed');
      handleModal(<RequestFailedModal error="Please enter numbers only. Thank you!" />);
    }
  };

  const onMax = () => {
    const approvalAmount = weakBalance.minus(NOMallowance);

    let objUpdate = new Map();
    objUpdate = objUpdate.set('approveAmount', approvalAmount);

    objDispatch({
      type: 'update',
      value: objUpdate,
    });

    let strUpdate = new Map();
    strUpdate = strUpdate.set('approve', format18(approvalAmount).toString());

    strDispatch({
      type: 'update',
      value: strUpdate,
    });
  };

  const inputDisplay = parseFloat(input || 0).toFixed(6);
  const initApproveAmountDisplay = format18(initialApproveAmount || 0).toFixed(6);

  return (
    <Modal.Wrapper>
      <Modal.CloseIcon onClick={() => handleModal()} data-testid="approve-tokens-modal-close-icon">
        <Close />
      </Modal.CloseIcon>

      <main>
        <Caption>Approve Tokens</Caption>

        <Message>
          You have approved the Bonding Curve to sell up to <strong>{inputDisplay} bNOM</strong>. To
          sell <strong>{inputDisplay} bNOM</strong>, you must approve at least an additional{' '}
          <strong>{initApproveAmountDisplay} bNOM</strong>.
        </Message>

        <ApproveTokensWrapper>
          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="">Approve tokens (bNOM)</label>
            <input type="text" placeholder="0.00" value={approve} onChange={onTextChange} />
          </div>
          <MaxBtn onClick={onMax}>MAX</MaxBtn>
        </ApproveTokensWrapper>
      </main>
      <footer>
        <Modal.FooterControls>
          <Modal.SecondaryButton
            onClick={() => handleModal()}
            data-testid="approve-tokens-modal-secondary-button"
          >
            Cancel
          </Modal.SecondaryButton>
          <Modal.PrimaryButton
            onClick={onConfirmApprove}
            data-testid="approve-tokens-modal-primary-button"
          >
            Approve ({count})
          </Modal.PrimaryButton>
        </Modal.FooterControls>
      </footer>
    </Modal.Wrapper>
  );
}
