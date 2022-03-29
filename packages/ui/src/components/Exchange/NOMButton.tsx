import React from 'react';
import { useOnomyEth } from '@onomy/react-eth';

import { useExchange } from 'context/exchange/ExchangeContext';
import { SellBtn } from './exchangeStyles';

export default function NOMButton({
  onBid,
  onApprove,
}: {
  onBid?: React.MouseEventHandler<HTMLButtonElement>;
  onApprove?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const { weakBalance, NOMallowance } = useOnomyEth();

  const { bidAmount, bidDenom, input, weak } = useExchange();

  if (bidDenom === 'strong') return <SellBtn>Sell {weak}</SellBtn>;
  if (bidAmount.lte(weakBalance)) {
    if (input === '') return <SellBtn>Sell {weak}</SellBtn>;
    if (NOMallowance.gte(bidAmount)) return <SellBtn onClick={onBid}>Sell {weak}</SellBtn>;
    return <SellBtn onClick={onApprove}>Approve</SellBtn>;
  }
  return <SellBtn> Exceeds Available {weak} </SellBtn>;
}
