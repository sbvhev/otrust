import React, { useState, useEffect, useCallback } from 'react';
import { BigNumber } from 'bignumber.js';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { useOnomy } from '@onomy/react-client';
import { useOnomyEth } from '@onomy/react-eth';
import { OnomyAddress } from '@onomy/client';

import BridgeSwapMobile from './BridgeSwapMobile';
import BridgeSwapModal from './BridgeSwapModal';
import { NOTIFICATION_MESSAGES } from '../../../constants/NotificationMessages';
import { responsive } from 'theme/constants';
import { useGasPriceSelection } from 'hooks/useGasPriceSelection';
import { ConnectKeplr } from 'components/ConnectKeplr';

export const initialErrorsState = { amountError: '', onomyWalletError: '', transactionError: '' };

export const initialGasOptions = [
  {
    id: 0,
    text: '00.00 (Standard)',
  },
  {
    id: 1,
    text: '00.00 (Fast)',
  },
  {
    id: 2,
    text: '00.00 (Instant)',
  },
];

export default function BridgeSwapMain() {
  const {
    address: onomyWalletValue,
    setAddress: setOnomyWalletValue,
    addPendingBridgeTransaction,
  } = useOnomy();
  const navigate = useNavigate();
  const [amountValue, setAmountValue] = useState('');
  const [errors, setErrors] = useState(initialErrorsState);
  const [formattedWeakBalance, setFormattedWeakBalance] = useState(new BigNumber(0));
  const [isDisabled, setIsDisabled] = useState(false);
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [allowanceAmountGravity, setAllowanceAmountGravity] = useState(new BigNumber(0));
  const [showBridgeExchangeModal, setShowBridgeExchangeModal] = useState(true);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showTransactionCompleted, setShowTransactionCompleted] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const { gasPriceChoice, setGasPriceChoice, gasOptions, gasPrice } = useGasPriceSelection();

  const standardBrigdeBreakpoint = useMediaQuery({ minWidth: responsive.smartphoneLarge });

  const { weakBalance, bondingCurve, web3Context } = useOnomyEth();
  const { account } = web3Context;

  useEffect(() => {
    setFormattedWeakBalance(weakBalance.shiftedBy(-18));
  }, [weakBalance]);

  const updateAllowanceAmount = useCallback(async () => {
    if (!account) {
      throw new Error();
    }
    const allowanceGravity = await bondingCurve.bNomBridgeAllowance(account);
    setAllowanceAmountGravity(allowanceGravity);
    return allowanceGravity;
  }, [bondingCurve, account, setAllowanceAmountGravity]);

  useEffect(() => {
    if (bondingCurve && account && allowanceAmountGravity.eq(0)) {
      updateAllowanceAmount();
    }
  }, [bondingCurve, account, allowanceAmountGravity, updateAllowanceAmount]);

  const walletChangeHandler: React.ChangeEventHandler<HTMLInputElement> = event => {
    setOnomyWalletValue(event.target.value);
  };

  const amountChangeHandler: React.ChangeEventHandler<HTMLInputElement> = event => {
    const { value } = event.target;
    const floatRegExp = new RegExp(
      /(^(?=.+)(?:[1-9]\d*|0)?(?:\.\d{1,18})?$)|(^\d+?\.$)|(^\+?(?!0\d+)$|(^$)|(^\.$))/
    );
    if (floatRegExp.test(value)) {
      setAmountValue(value);
      const bigAmountShifted18 = new BigNumber(value).shiftedBy(18);
      if (bigAmountShifted18.gt(weakBalance)) {
        setErrors(prevState => {
          return { ...prevState, amountError: NOTIFICATION_MESSAGES.error.insufficientFunds };
        });
        setIsDisabled(true);
      } else {
        setErrors(prevState => {
          return { ...prevState, amountError: '' };
        });
        setIsDisabled(false);
      }
    }
  };

  const maxBtnClickHandler: React.MouseEventHandler<HTMLButtonElement> = event => {
    event.preventDefault();
    if (weakBalance.toNumber()) {
      setAmountValue(formattedWeakBalance.toString(10));
      setIsDisabled(false);
    }
  };

  const onCancelClickHandler = () => {
    setShowApproveModal(false);
    setShowBridgeExchangeModal(true);
    setIsDisabled(false);
    updateAllowanceAmount();
  };

  function closeBridgeModal() {
    navigate('/');
  }

  const closeModal = () => {
    if (!isTransactionPending) {
      closeBridgeModal();
    }
  };

  const submitTransClickHandler: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    async event => {
      event.preventDefault();
      setErrors(initialErrorsState);
      if (amountValue === '.' || !parseFloat(amountValue)) {
        setErrors(prevState => {
          return { ...prevState, amountError: NOTIFICATION_MESSAGES.error.incorrectAmountFormat };
        });
        return;
      }
      const amountValueAtoms = new BigNumber(amountValue).shiftedBy(18);
      try {
        setIsDisabled(true);
        OnomyAddress.validate(onomyWalletValue);
      } catch (error) {
        setErrors(prevState => {
          return {
            ...prevState,
            onomyWalletError: NOTIFICATION_MESSAGES.error.incorrectOnomyAddressFormat,
          };
        });
        setIsDisabled(false);
        return;
      }

      if (allowanceAmountGravity.gte(amountValueAtoms)) {
        try {
          setShowLoader(true);
          setIsTransactionPending(true);

          addPendingBridgeTransaction(new BigNumber(amountValue));
          await bondingCurve.bridgeBNOMSendToCosmos(onomyWalletValue, amountValueAtoms, gasPrice);

          setIsDisabled(false);
          setShowBridgeExchangeModal(false);
          setShowTransactionCompleted(true);
          setShowLoader(false);
          setIsTransactionPending(false);
        } catch (error: any) {
          if (error.code === 4001) {
            setErrors(prevState => {
              return {
                ...prevState,
                transactionError: NOTIFICATION_MESSAGES.error.rejectedTransaction,
              };
            });
          } else {
            setErrors(prevState => {
              return { ...prevState, transactionError: error.message };
            });
          }

          setShowLoader(false);
          setIsDisabled(false);
          setIsTransactionPending(false);
        }
      } else {
        setShowBridgeExchangeModal(false);
        setShowApproveModal(true);
      }
    },
    [
      amountValue,
      allowanceAmountGravity,
      onomyWalletValue,
      bondingCurve,
      gasPrice,
      addPendingBridgeTransaction,
    ]
  );

  const Props = {
    values: {
      onomyWalletValue,
      amountValue,
      formattedWeakBalance,
      allowanceAmountGravity,
      weakBalance,
      errors,
      gasPrice,
      gasPriceChoice,
      gasOptions,
    },
    flags: {
      isDisabled,
      isTransactionPending,
      showBridgeExchangeModal,
      showApproveModal,
      showTransactionCompleted,
      showLoader,
    },
    handlers: {
      walletChangeHandler,
      amountChangeHandler,
      maxBtnClickHandler,
      submitTransClickHandler,
      onCancelClickHandler,
      closeModal,
      setGasPriceChoice,
    },
  };

  return (
    <>
      <ConnectKeplr />
      {standardBrigdeBreakpoint ? <BridgeSwapModal {...Props} /> : <BridgeSwapMobile {...Props} />}
    </>
  );
}
