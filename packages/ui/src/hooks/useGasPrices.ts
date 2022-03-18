import BigNumber from 'bignumber.js';
import { useCallback } from 'react';
import { useAsyncValue } from '@onomy/react-utils';
import { useOnomyEth } from '@onomy/react-eth';

export function useGasPrices() {
  const { web3Context } = useOnomyEth();
  const { library } = web3Context;
  const query = useCallback(async () => {
    const base = await library.getGasPrice();
    const safe = new BigNumber(base.toString());
    const propose = safe.multipliedBy(1.1);
    const fast = safe.multipliedBy(1.2);
    return {
      safe,
      propose,
      fast,
    };
  }, [library]);

  return useAsyncValue(query, {
    safe: new BigNumber('0'),
    propose: new BigNumber('0'),
    fast: new BigNumber('0'),
  });
}
